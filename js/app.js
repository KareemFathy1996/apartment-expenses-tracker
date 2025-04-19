document.addEventListener('DOMContentLoaded', () => {
    // Load data first
    loadFromStorage();
    
    // Restore optional items filter state
    const optionalCheckbox = document.getElementById('showOptionalItems');
    const savedOptionalState = localStorage.getItem('showOptionalItems');
    if (savedOptionalState !== null) {
        optionalCheckbox.checked = savedOptionalState === 'true';
    }
    
    // Apply filters with restored state
    applyFilters();
    
    // Set up event listeners
    document.getElementById('addItemButton').addEventListener('click', addItemFromInputs);
    document.getElementById('showOptionalItems').addEventListener('change', applyFilters);
    document.getElementById('budgetInput').addEventListener('input', calculateTotals);
    
    // Enter key listeners
    ['itemInput', 'minCost', 'maxCost', 'avgCost'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addItemFromInputs();
        });
    });
});