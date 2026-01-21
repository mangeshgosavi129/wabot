const Users = () => {
return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Message Templates</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage standard messages approved by WhatsApp.</p>
                </div>
                <Button><Plus className="w-4 h-4 mr-2" /> New User</Button>
            </div>
        </div>
    );
};

export default Users;