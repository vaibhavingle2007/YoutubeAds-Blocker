document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('adBlockToggle');
    const statusText = document.getElementById('status');
  
    // Restore previous state
    chrome.storage.local.get(['adBlockingEnabled'], (result) => {
      toggle.checked = result.adBlockingEnabled !== false;
      updateStatus(toggle.checked);
    });
  
    // Toggle event
    toggle.addEventListener('change', () => {
      const isEnabled = toggle.checked;
      
      // Send message to background script
      chrome.runtime.sendMessage(
        { action: 'toggleAdBlocking' },
        (response) => {
          if (response.status === 'success') {
            updateStatus(isEnabled);
          }
        }
      );
    });
  
    function updateStatus(enabled) {
      statusText.textContent = `Ad Blocking: ${enabled ? 'ON' : 'OFF'}`;
    }
  });