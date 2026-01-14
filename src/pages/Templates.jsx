import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Plus, MoreHorizontal, FileText, CheckCircle, Clock } from 'lucide-react';
import Modal from '../components/ui/Modal';

const Templates = () => {
    const { templates } = useApp();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const filteredTemplates = templates.filter(t =>
        (filter === 'all' || t.category === filter) &&
        t.body.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage standard messages approved by WhatsApp.</p>
                </div>
                <Button><Plus className="w-4 h-4 mr-2" /> New Template</Button>
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
                    <div className="flex gap-1">
                        {['all', 'marketing', 'utility', 'authentication'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-white dark:bg-gray-800 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${template.category === 'marketing' ? 'bg-primary/10 text-primary' :
                                    template.category === 'utility' ? 'bg-cyan-100 text-cyan-700' :
                                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {template.category}
                                </span>
                                <div className="flex items-center gap-2">
                                    {template.status === 'approved' ? (
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
                                {template.body}
                            </p>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>{template.language.toUpperCase()}</span>
                                <span>Cost: {template.cost} credits</span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTemplate(template)}>Preview</Button>
                                <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={!!selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
                title="Template Preview"
            >
                <div className="bg-gray-100 p-4 rounded-xl max-w-sm mx-auto my-4 relative">
                    <div className="bg-white p-3 rounded-lg shadow-sm rounded-tl-none">
                        <p className="text-sm text-gray-900">
                            {selectedTemplate?.body.replace('{{name}}', 'John Doe').replace('{{link}}', 'example.com').replace('{{code}}', '123456')}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 text-right">10:30 AM</p>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-500">Variables like name and link are replaced dynamically.</p>
            </Modal>
        </div>
    );
};

export default Templates;
