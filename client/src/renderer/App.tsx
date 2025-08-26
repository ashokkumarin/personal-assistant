import React, { JSX, useState } from 'react'

// Add global type declaration for ImportMetaEnv to fix the error.
declare global {
    interface ImportMetaEnv {
        readonly VITE_API_BASE?: string
        [key: string]: any
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv
    }
}

// Change this to your AWS API URL via VITE_API_BASE in .env
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

type ParsedTask = {
    title: string
    description?: string
    dueDate?: string // ISO date
    time?: string // e.g. "18:00"
    reminder?: string
}

export default function App(): JSX.Element {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [parsed, setParsed] = useState<ParsedTask | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [recurring, setRecurring] = useState(false)
    const [recurrenceRule, setRecurrenceRule] = useState('')

    async function handleSend() {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/parse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!res.ok) throw new Error('Parse failed');
            const data = await res.json();
            // validate shape
            setParsed({
                title: data.title || '',
                description: data.description || '',
                dueDate: data.dueDate || '',
                time: data.time || '',
                reminder: data.reminder || ''
            });
            setShowForm(true);
        } catch (err) {
            alert('Failed to parse text: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm() {
        if (!parsed) return
        const payload = {
            ...parsed,
            recurring: recurring ? { rule: recurrenceRule } : null
        }
        try {
            const res = await fetch(`${API_BASE}/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (!res.ok) throw new Error('Confirm failed')
            const data = await res.json()
            alert('Confirmed! Server id: ' + (data.id || 'unknown'))
            // reset UI
            setText('')
            setParsed(null)
        } catch (err) {
            alert('Failed to confirm: ' + (err as Error).message)
        } finally {
            
        }
    }

    return (
        <div>
            <h1>Personal Assistant</h1>
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type your task here..."
                rows={4}
                cols={40}
                disabled={loading}
            />
            <br />
            <button onClick={handleSend} disabled={loading || !text.trim()}>
                {loading ? 'Parsing...' : 'Parse Task'}
            </button>
            {showForm && parsed && (
                <div>
                    <h2>Parsed Task</h2>
                    <div>Title: {parsed.title}</div>
                    <div>Description: {parsed.description}</div>
                    <div>Due Date: {parsed.dueDate}</div>
                    <div>Time: {parsed.time}</div>
                    <div>Reminder: {parsed.reminder}</div>
                    <label>
                        <input
                            type="checkbox"
                            checked={recurring}
                            onChange={e => setRecurring(e.target.checked)}
                        />
                        Recurring
                    </label>
                    {recurring && (
                        <input
                            type="text"
                            value={recurrenceRule}
                            onChange={e => setRecurrenceRule(e.target.value)}
                            placeholder="Recurrence rule"
                        />
                    )}
                    <button onClick={handleConfirm}>Confirm</button>
                </div>
            )}
        </div>
    );
}
