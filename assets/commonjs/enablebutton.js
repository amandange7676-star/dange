const toggle = document.getElementById('myToggle');
const projectId = window.location.pathname.split('/').pop();  // Assuming the project ID is part of the URL path, adjust accordingly

// Fetch the initial feature status from the backend when the page loads
fetch(`/get_status/?project_url=${projectId}`)
  .then(response => response.json())
  .then(data => {
    const featureEnabled = data.featureEnabled;
    toggle.checked = featureEnabled;
    
    // Your global variable
    let isFeatureEnabled = featureEnabled;

    // Listener to update the feature flag when toggled
    toggle.addEventListener('change', () => {
        isFeatureEnabled = toggle.checked;
        console.log('isFeatureEnabled: ', isFeatureEnabled)

        // Enable/Disable your feature
        if (isFeatureEnabled) {
            enableYourFeature();
        } else {
            disableYourFeature();
        }

        // Send the update to the backend
        updateFeatureInBackend(isFeatureEnabled);
    });

    // Optionally enable feature on load if it was already on
    if (isFeatureEnabled) {
        enableYourFeature();
    }

    // Example functions to enable/disable feature
    function enableYourFeature() {
        console.log('Feature Enabled');
        // Your logic to enable the feature
    }

    function disableYourFeature() {
        console.log('Feature Disabled');
        // Your logic to disable the feature
    }

    // Function to send the request to the backend to update the feature
    function updateFeatureInBackend(isFeatureEnabled) {
        const data = new FormData();
        data.append('project_url', projectId);
        data.append('enable_feature', isFeatureEnabled.toString());

        fetch('/enable_feature/', {
            method: 'POST',
            body: data,
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Feature updated successfully');
            } else {
                console.log('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Request failed', error);
        });
    }
})
.catch(error => {
    console.error('Error fetching feature status:', error);
});
