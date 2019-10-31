const User = require("../../models/user");
const GroupRoles = require("../../models/groupRoles")
const GroupMember = require("../../models/groupMember")
const Group = require("../../models/group")

const verifyRole = async (userId, groupId, requiredPermissionLevel) => {

    const user = await User.findById(userId);
    if (!user) return ("Could not find User");
    var ret = false;

    for (let groupMemberId of user.userGroups) {
        const member = await GroupMember.findById(groupMemberId);
        if (member) {
            if (member.group == groupId) {
                const role = await GroupRoles.findById(member.groupMemberRole);

                if (role.groupRolePermisionLevel >= requiredPermissionLevel) {
                    ret = true;
                }
                break;
            }
        }
    }
    return ret;
}

module.exports.verifyRole = verifyRole;