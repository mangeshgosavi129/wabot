import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/apis';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Plus, CheckCircle, Clock, Trash2, Send, Edit2, Eye } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { TemplateStatus } from '../lib/types';

const Templates = () => {
    const { templates } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        category: 'MARKETING',
        language: 'en_US',
        header: '',
        body: '',
        footer: '',
        buttons: []
    });
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const filteredTemplates = (templates || []).filter(t =>
        (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.category || '').toLowerCase().includes(search.toLowerCase())
    );

    const getBodyContent = (template) => {
        const bodyComponent = template.components?.find(c => c.type === 'BODY');
        return bodyComponent?.text || '';
    };

    const handleOpenCreateModal = () => {
        setEditingTemplate(null);
        setNewTemplate({
            name: '',
            category: 'MARKETING',
            language: 'en_US',
            header: '',
            body: '',
            footer: '',
            buttons: []
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (template) => {
        setEditingTemplate(template);
        const header = template.components?.find(c => c.type === 'HEADER')?.text || '';
        const body = template.components?.find(c => c.type === 'BODY')?.text || '';
        const footer = template.components?.find(c => c.type === 'FOOTER')?.text || '';

        setNewTemplate({
            name: template.name,
            category: template.category,
            language: template.language,
            header,
            body,
            footer,
            buttons: template.buttons || []
        });
        setIsModalOpen(true);
    };

    const handleSaveTemplate = async () => {
        try {
            setSaving(true);
            const components = [];

            if (newTemplate.header) {
                components.push({ type: 'HEADER', format: 'TEXT', text: newTemplate.header });
            }

            components.push({ type: 'BODY', text: newTemplate.body });

            if (newTemplate.footer) {
                components.push({ type: 'FOOTER', text: newTemplate.footer });
            }

            if (newTemplate.buttons?.length > 0) {
                components.push({ type: 'BUTTONS', buttons: newTemplate.buttons });
            }

            const payload = {
                name: newTemplate.name.toLowerCase().replace(/\s+/g, '_'),
                category: newTemplate.category,
                language: newTemplate.language,
                components: components
            };

            if (editingTemplate) {
                await api.updateTemplate(editingTemplate.id, payload);
            } else {
                await api.createTemplate(payload);
            }

            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to save template:', error);
            alert(`Failed to save template: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitToMeta = async (templateId) => {
        try {
            await api.submitTemplate(templateId);
            alert('Template submitted to Meta for approval');
            window.location.reload();
        } catch (error) {
            console.error('Failed to submit template:', error);
            alert(`Failed to submit template: ${error.message}`);
        }
    };

    const handleDeleteTemplate = async (templateId, e) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            await api.deleteTemplate(templateId);
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete template:', error);
            alert(`Failed to delete template: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage standard messages approved by WhatsApp.</p>
                </div>
                <Button onClick={handleOpenCreateModal}><Plus className="w-4 h-4 mr-2" /> New Template</Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search templates..."
                            className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 flex flex-col group relative">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase block truncate max-w-[150px]">
                                        {template.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 uppercase font-medium">{template.category} • {template.language}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {template.status === TemplateStatus.APPROVED ? (
                                        <CheckCircle className="w-4 h-4 text-cyan-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-accent" />
                                    )}
                                    {template.status === TemplateStatus.DRAFT && (
                                        <button
                                            onClick={(e) => handleDeleteTemplate(template.id, e)}
                                            className="text-gray-300 hover:text-red-500 transition-colors ml-1 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                            title="Delete Template"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 mb-4 line-clamp-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-50 dark:border-gray-800 italic">
                                "{getBodyContent(template)}"
                            </p>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-[10px] font-medium">{template.status}</span>
                                <span>{new Date(template.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 px-1 h-8 text-xs" onClick={() => setSelectedTemplate(template)}>
                                    <Eye className="w-3 h-3 mr-1" /> Preview
                                </Button>
                                {template.status === TemplateStatus.DRAFT && (
                                    <>
                                        <Button variant="ghost" size="sm" className="flex-1 px-1 h-8 text-xs border border-gray-100 dark:border-gray-700" onClick={() => handleOpenEditModal(template)}>
                                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                                        </Button>
                                        <Button size="sm" className="flex-1 px-1 h-8 text-xs" onClick={() => handleSubmitToMeta(template.id)}>
                                            <Send className="w-3 h-3 mr-1" /> Submit
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {!filteredTemplates.length && (
                        <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                            No templates found.
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={!!selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
                title="Template Preview"
            >
                <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl max-w-sm mx-auto my-4 border border-gray-200 dark:border-gray-800">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm rounded-tl-none border border-gray-100 dark:border-gray-700 space-y-2">
                        {selectedTemplate?.components?.map((comp, idx) => {
                            if (comp.type === 'HEADER') return <div key={idx} className="font-bold text-sm border-b pb-1 mb-2 dark:text-white">{comp.text}</div>;
                            if (comp.type === 'BODY') return <div key={idx} className="text-sm dark:text-gray-200 whitespace-pre-wrap">{comp.text}</div>;
                            if (comp.type === 'FOOTER') return <div key={idx} className="text-[11px] text-gray-400 dark:text-gray-500 pt-1">{comp.text}</div>;
                            return null;
                        })}
                        <p className="text-[10px] text-gray-400 mt-1 text-right">Recently</p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTemplate ? "Edit Template" : "Create New Template"}
            >
                <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Template Name"
                            placeholder="e.g. welcome_msg"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                            disabled={!!editingTemplate}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                className="w-full h-10 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white text-sm"
                                value={newTemplate.category}
                                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                            >
                                <option value="MARKETING">Marketing</option>
                                <option value="UTILITY">Utility</option>
                                <option value="AUTHENTICATION">Authentication</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                        <select
                            className="w-full h-10 px-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white text-sm"
                            value={newTemplate.language}
                            onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                        >
                            <option value="en_US">English (US)</option>
                            <option value="en_GB">English (UK)</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                        </select>
                    </div>

                    <Input
                        label="Header (Optional)"
                        placeholder="Welcome to our shop!"
                        value={newTemplate.header}
                        onChange={(e) => setNewTemplate({ ...newTemplate, header: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Body Content (Required)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white text-sm"
                            rows={4}
                            placeholder="Hello {{1}}, welcome to our platform!"
                            value={newTemplate.body}
                            onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Use {'{{1}}'}, {'{{2}}'} for variables.</p>
                    </div>

                    <Input
                        label="Footer (Optional)"
                        placeholder="Reply STOP to opt out"
                        value={newTemplate.footer}
                        onChange={(e) => setNewTemplate({ ...newTemplate, footer: e.target.value })}
                    />

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveTemplate} disabled={saving || !newTemplate.name || !newTemplate.body}>
                            {saving ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Create Template')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Templates;
