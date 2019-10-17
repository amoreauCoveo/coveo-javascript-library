module.exports = function getFormattedPermissions(document, allowedGroups, deniedGroups, typeOfGroup, permissionIndex = 0) {

  function addFormattedPermissionSet(permissionSet, groupToAdd, typeOfGroup) {
    groupToAdd.forEach(group => {
      permissionSet.push({
        "identity": group,
        "identityType": typeOfGroup
      })
    });

    return permissionSet;
  }

  if (!document.permissions || !document.documentId) {
    console.log('Document was not properly configured. Use Coveo.document.create first before adding permissions.')
  }

  if (document.permissions[permissionIndex].allowAnonymous) {
    document.permissions[permissionIndex].allowAnonymous = false;
  }

  if (Array.isArray(allowedGroups)) {
    document.permissions[permissionIndex].allowedPermissions = addFormattedPermissionSet(document.permissions[permissionIndex].allowedPermissions, allowedGroups, typeOfGroup);
  }

  if (Array.isArray(deniedGroups)) {
    document.permissions[permissionIndex].deniedPermissions = addFormattedPermissionSet(document.permissions[permissionIndex].deniedPermissions, deniedGroups, typeOfGroup);
  }

  return document;
}