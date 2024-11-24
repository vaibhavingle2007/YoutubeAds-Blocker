// Dynamic Ad Blocking Configuration
const CONFIG = {
    adBlockingEnabled: true,
    blockList: [
      '*://*.doubleclick.net/*',
      '*://pubads.g.doubleclick.net/*',
      '*://googleads.g.doubleclick.net/*',
      '*://*.googlesyndication.com/*',
      '*://youtube.com/api/stats/ads'
    ]
  };
  
  // Initialize Extension
  chrome.runtime.onInstalled.addListener(async () => {
    try {
      // Enable ad blocking rules
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['youtube_adblock_rules'],
        disableRulesetIds: []
      });
  
      // Store initial state
      await chrome.storage.local.set({ 
        adBlockingEnabled: true 
      });
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  });
  
  // Message Listener for Toggle Functionality
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleAdBlocking') {
      handleAdBlockingToggle(sendResponse);
      return true; // Allow async response
    }
  });
  
  // Toggle Ad Blocking
  async function handleAdBlockingToggle(sendResponse) {
    try {
      // Toggle state
      CONFIG.adBlockingEnabled = !CONFIG.adBlockingEnabled;
  
      // Update storage
      await chrome.storage.local.set({ 
        adBlockingEnabled: CONFIG.adBlockingEnabled 
      });
  
      // Dynamically update ruleset
      if (CONFIG.adBlockingEnabled) {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          enableRulesetIds: ['youtube_adblock_rules'],
          disableRulesetIds: []
        });
      } else {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
          enableRulesetIds: [],
          disableRulesetIds: ['youtube_adblock_rules']
        });
      }
  
      // Send success response
      sendResponse({
        status: 'success',
        enabled: CONFIG.adBlockingEnabled
      });
    } catch (error) {
      console.error('Toggle failed:', error);
      sendResponse({
        status: 'error',
        message: error.toString()
      });
    }
  }
  
  // Optional: Logging for debugging
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((details) => {
    console.log('Blocked Request:', details.request.url);
  });