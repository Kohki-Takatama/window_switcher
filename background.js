chrome.commands.onCommand.addListener((command) => {
  if (command === "move_tab_to_new_window") {
    // 現在のタブを新しいウィンドウに移動
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        chrome.windows.create({ tabId: currentTab.id });
      }
    });
  } else if (command === "move_tab_to_other_window") {
    // 現在のタブを別の既存のウィンドウに移動し、アクティブにする
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.windows.getAll({ populate: true }, (windows) => {
        const otherWindows = windows.filter(w => !w.focused);
        if (currentTab && otherWindows.length > 0) {
          chrome.tabs.move(currentTab.id, { windowId: otherWindows[0].id, index: -1 }, (movedTab) => {
            // 移動後にタブをアクティブにする
            chrome.tabs.update(movedTab.id, { active: true });
            // ウィンドウ自体もアクティブにする
            chrome.windows.update(otherWindows[0].id, { focused: true });
          });
        }
      });
    });
  } else if (command === "focus_next_tab") {
    // 次のタブにフォーカスを移動
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      let activeTabIndex = tabs.findIndex(tab => tab.active);
      if (activeTabIndex >= 0 && activeTabIndex < tabs.length - 1) {
        chrome.tabs.update(tabs[activeTabIndex + 1].id, { active: true });
      } else {
        chrome.tabs.update(tabs[0].id, { active: true });  // 最初のタブに戻る
      }
    });
  } else if (command === "focus_next_window") {
    // 次のウィンドウにフォーカスを移動
    chrome.windows.getAll({}, (windows) => {
      let currentIndex = windows.findIndex(w => w.focused);
      if (currentIndex >= 0 && currentIndex < windows.length - 1) {
        chrome.windows.update(windows[currentIndex + 1].id, { focused: true });
      } else {
        chrome.windows.update(windows[0].id, { focused: true });  // 最初のウィンドウに戻る
      }
    });
  }
});
