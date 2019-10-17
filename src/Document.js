module.exports = class Document {
  constructor(uri, body, fields) {
    this.documentId = uri;
    this.uri = uri;
    this.data = body;
    this.permissions = [
      {
        allowAnonymous: true,
        allowedPermissions: [],
        deniedPermissions: []
      }
    ]

    Object.entries(fields).forEach(value => {
      this[value[0]] = value[1];
    })
  }

  addEmailPermissions(allowedEmails, deniedEmails) {
    const getFormattedPermissions = require('../utils/getFormattedPermissions');
    return getFormattedPermissions(this, allowedEmails, deniedEmails, 'User');
  }

  addGroupPermissions(allowedGroups, deniedGroups) {
    const getFormattedPermissions = require('../utils/getFormattedPermissions');
    return getFormattedPermissions(this, allowedGroups, deniedGroups, 'Group');
  }

  addVirtualGroupPermissions(allowedGroups, deniedGroups) {
    const getFormattedPermissions = require('../utils/getFormattedPermissions');
    return getFormattedPermissions(this, allowedGroups, deniedGroups, 'VirtualGroup');
  }

  addCascadingPermissions(allowedGroups, deniedGroups, groupType, groupNumber) {
    const getFormattedPermissions = require('../utils/getFormattedPermissions');
    isValidGroupType = groupType == "User" || groupType == "Group" || groupType == "VirtualGroup";
    if (!isValidGroupType) {
      console.log('Group Type is not valid. Valid types are: "User", "Group", and "VirtualGroup".')
      return;
    }
    if (!groupNumber || Number.isNaN(groupNumber)) {
      groupNumber = this.permissions.length + 1;
    }
    return getFormattedPermissions(this, allowedGroups, deniedGroups, groupType, groupNumber);
  }
}