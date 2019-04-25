export const objEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const removeArrayFromObj = obj => {
  for (var key in obj) {
    if (obj[key].constructor === Array) {
      delete obj[key];
      return obj;
    }
  }
};

export const areArrysEqual = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((element, index) => element === arr2[index])
  );
};

// export const checkIfArrayExistsInAnother = (arr1, arr2) => {
//   return (
//     arr1.filter(elem => {
//       return arr2.indexOf(elem) > -1;
//     }).length == arr2.length
//   );
// };
export const checkIfArrayExistsInAnother = (arr1, arr2) => {
  return arr1.every(elem => arr2.indexOf(elem) > -1);
};

export const validateListOfStrings = array => {
  let validation = [];
  let validObjects = 0;
  array.forEach(x => {
    var objKey = Object.keys(x)[0];
    var objValue = x[Object.keys(x)[0]];
    if (typeof objKey === "string" || typeof objKey === "number") {
      if (objValue !== "") {
        validation.push({ value: objKey, isValid: true });
      } else {
        validation.push({ value: objKey, isValid: false });
      }
    } else {
      return validation;
    }
  });

  validation.forEach(x => {
    var objKey = Object.keys(x)[1];
    var objValue = x[Object.keys(x)[1]];
    if (objKey === "isValid" && objValue === true) {
      validObjects++;
    }
  });

  if (validObjects === array.length) {
    const valid = { isValid: true };
    validation.push(valid);
  } else {
    const valid = { isValid: false };
    validation.push(valid);
  }

  return validation;
};

export const isObjectValid = obj => {
  for (var key in obj) {
    if (obj[key] === null && obj[key] === "") return false;
  }
  return true;
};

// Inner array validation
// else if (Array.isArray(objKey)) {
//   const arrayValid = validatePage(objKey);
//   if (arrayValid && objKey.length > 0) {
//     valid = true;
//     return;
//   } else valid = false;
// }

export function validateItems(validatedList) {
  validatedList.forEach(item => {
    if (!item.isValid) {
      const itemToValidate = `${item.value}IsValid`;
      this.setState({ [itemToValidate]: false });
    }
  });
}

export function removeValidationErrors(listToValidate) {
  listToValidate.forEach(item => {
    const itemToValidate = `${Object.keys(item)[0]}IsValid`;
    this.setState({ [itemToValidate]: true });
  });
}

export function validateItem(item) {
  const itemToValidate = `${item}IsValid`;
  return this.state[itemToValidate] === false ? false : true;
}

export function setItemToValidate(item) {
  const itemToValidate = `${item}IsValid`;
  this.setState({ [itemToValidate]: true });
}

export function checkForErrors(itemToCheck, displayFormat) {
  let error;
  switch (displayFormat) {
    case "modal":
      if (itemToCheck instanceof Error) {
        this.setState({ showErrorModal: true, hasErrors: true });
        error = true;
      }
      break;
    case "message":
      if (itemToCheck instanceof Error) {
        this.setState({ showErrorMessage: true, hasErrors: true });
        error = true;
      }
      break;
    default:
      error = false;
  }
  return error;
}
