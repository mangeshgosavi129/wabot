import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../lib/apis';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Plus, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { TemplateStatus } from '../lib/types';

const Templates = () => {
    const { templates, loading } = useApp();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });
    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const filteredTemplates = (templates || []).filter(t =>
        (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.content || '').toLowerCase().includes(search.toLowerCase())
    );

    const handleCreateTemplate = async () => {
        try {
            setCreating(true);
            await api.createTemplate(newTemplate);
            setIsCreateModalOpen(false);
            setNewTemplate({ name: '', content: '' });
            // Ideally trigger refresh or update context
            window.location.reload(); // Simple refresh for now
        } catch (error) {
            console.error('Failed to create template:', error);
            alert('Failed to create template');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage standard messages approved by WhatsApp.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}><Plus className="w-4 h-4 mr-2" /> New Template</Button>
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
                        <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase truncate max-w-[150px]">
                                    {template.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    {template.status === TemplateStatus.APPROVED ? (
                                        <CheckCircle className="w-4 h-4 text-cyan-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-accent" />
                                    )}
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 mb-4 line-clamp-4">
                                {template.content}
                            </p>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span className="capitalize">Status: {template.status}</span>
                                <span>{new Date(template.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTemplate(template)}>Preview</Button>
                                {/* Edit functionality to be implemented */}
                                <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
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
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl max-w-sm mx-auto my-4 relative">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm rounded-tl-none border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                            {selectedTemplate?.content}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 text-right">10:30 AM</p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Template"
            >
                <div className="space-y-4">
                    <Input
                        label="Template Name"
                        placeholder="e.g. welcome_msg"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                            rows={4}
                            placeholder="Hello {{1}}, welcome to our platform!"
                            value={newTemplate.content}
                            onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateTemplate} disabled={creating}>
                            {creating ? 'Creating...' : 'Create Template'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Templates;
