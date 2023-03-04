const saveToLocalStorage = (keyName = "", objName = {}) => {
  if (keyName) localStorage.setItem(keyName, JSON.stringify(objName));
};

const saveToSessionStorage = (keyName = "", objName = {}) => {
  if (keyName) sessionStorage.setItem(keyName, JSON.stringify(objName));
};

const getDataFromStorage = (storage, keyName) => {
  if (storage && keyName) {
    const data = storage.getItem(keyName);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }
};

const removeFromLocalStorage = (keyName) => {
  if (keyName) localStorage.removeItem(keyName);
};

const removeFromSessionStorage = (keyName) => {
  if (keyName) sessionStorage.removeItem(keyName);
};

export {
  saveToLocalStorage,
  saveToSessionStorage,
  removeFromLocalStorage,
  removeFromSessionStorage,
  getDataFromStorage,
};
