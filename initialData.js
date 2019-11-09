
const GroupRole = require('./models/groupRoles');
const Group = require('./models/group');


module.exports = (io) => {

    const dataService = require("./routes/groups/chatRoomService");
    const ChatData = dataService();

    return {
        initialData: async () => {
            const AdminRole = await GroupRole.findOne({ "groupRolePermisionLevel": process.env.ROLE_ADMIN });
            if (!AdminRole) {
                const AdminRole = await GroupRole.create({
                    groupRoleName: "Admin",
                    groupRolePermisionLevel: process.env.ROLE_ADMIN
                });
            }
            const MemberRole = await GroupRole.findOne({ "groupRolePermisionLevel": process.env.ROLE_MEMBER });
            if (!MemberRole) {
                const MemberRole = await GroupRole.create({
                    groupRoleName: "Member",
                    groupRolePermisionLevel: process.env.ROLE_MEMBER
                });
            }
            const OwnerRole = await GroupRole.findOne({ "groupRolePermisionLevel": process.env.ROLE_OWNER });
            if (!OwnerRole) {
                const OwnerRole = await GroupRole.create({
                    groupRoleName: "Owner",
                    groupRolePermisionLevel: process.env.ROLE_OWNER
                });
            }

            // Re-Initialize group namespaces
            const groups = await Group.find();
            for (group of groups){
                const setupNamespace = await ChatData.setupGroupNamespace(group._id, io);
            }
        }
    }
}