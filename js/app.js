// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Load data first
    loadFromStorage();
    
    // Set up event listeners
    document.getElementById('addItemButton').addEventListener('click', addItemFromInputs);
    document.getElementById('showOptionalItems').addEventListener('change', applyFilters);
    document.getElementById('budgetInput').addEventListener('input', calculateTotals);
    
    // Set up enter key listeners for inputs
    ['itemInput', 'minCost', 'maxCost', 'avgCost'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addItemFromInputs();
        });
    });
});