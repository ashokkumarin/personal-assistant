import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
// Change this to your AWS API URL via VITE_API_BASE in .env
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
export default function App() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsed, setParsed] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [recurring, setRecurring] = useState(false);
    const [recurrenceRule, setRecurrenceRule] = useState('');
    async function handleSend() {
        if (!text.trim())
            return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/parse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!res.ok)
                throw new Error('Parse failed');
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
        }
        catch (err) {
            alert('Failed to parse text: ' + err.message);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleConfirm() {
        if (!parsed)
            return;
        const payload = {
            ...parsed,
            recurring: recurring ? { rule: recurrenceRule } : null
        };
        try {
            const res = await fetch(`${API_BASE}/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok)
                throw new Error('Confirm failed');
            const data = await res.json();
            alert('Confirmed! Server id: ' + (data.id || 'unknown'));
            // reset UI
            setText('');
            setParsed(null);
        }
        catch (err) {
            alert('Failed to confirm: ' + err.message);
        }
        finally {
        }
    }
    return (_jsxs("div", { children: [_jsx("h1", { children: "Personal Assistant" }), _jsx("textarea", { value: text, onChange: e => setText(e.target.value), placeholder: "Type your task here...", rows: 4, cols: 40, disabled: loading }), _jsx("br", {}), _jsx("button", { onClick: handleSend, disabled: loading || !text.trim(), children: loading ? 'Parsing...' : 'Parse Task' }), showForm && parsed && (_jsxs("div", { children: [_jsx("h2", { children: "Parsed Task" }), _jsxs("div", { children: ["Title: ", parsed.title] }), _jsxs("div", { children: ["Description: ", parsed.description] }), _jsxs("div", { children: ["Due Date: ", parsed.dueDate] }), _jsxs("div", { children: ["Time: ", parsed.time] }), _jsxs("div", { children: ["Reminder: ", parsed.reminder] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: recurring, onChange: e => setRecurring(e.target.checked) }), "Recurring"] }), recurring && (_jsx("input", { type: "text", value: recurrenceRule, onChange: e => setRecurrenceRule(e.target.value), placeholder: "Recurrence rule" })), _jsx("button", { onClick: handleConfirm, children: "Confirm" })] }))] }));
}
