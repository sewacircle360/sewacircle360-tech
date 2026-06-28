const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Granular Permissions
  const permissionsList = [
    "manage_settings", "manage_users", "manage_roles", 
    "view_leads", "manage_leads", "view_clients", "manage_clients",
    "view_projects", "manage_projects", "view_invoices", "manage_invoices",
    "view_agreements", "manage_agreements", "view_quotations", "manage_quotations",
    "manage_products", "manage_services", "manage_portfolio", "manage_blog"
  ];

  const dbPermissions = [];
  for (const name of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name },
      update: {},
      create: { 
        name, 
        description: `Allows user to ${name.replace(/_/g, ' ')}` 
      },
    });
    dbPermissions.push(perm);
  }
  console.log(`Seeded ${dbPermissions.length} permissions.`);

  // Seed Base Roles
  const roles = ["SUPER_ADMIN", "ADMIN", "EMPLOYEE", "CLIENT"];
  const seededRoles = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { 
        name: roleName, 
        description: `${roleName.replace(/_/g, ' ')} Role` 
      },
    });
    seededRoles[roleName] = role;
  }
  console.log("Seeded basic roles.");

  // Link all permissions to SUPER_ADMIN
  for (const perm of dbPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: seededRoles["SUPER_ADMIN"].id,
          permissionId: perm.id,
        }
      },
      update: {},
      create: {
        roleId: seededRoles["SUPER_ADMIN"].id,
        permissionId: perm.id,
      }
    });
  }
  console.log("Linked all permissions to SUPER_ADMIN.");

  // Create default Super Admin User
  const adminEmail = "sewacircle360@gmail.com";
  const hashedPassword = await bcrypt.hash("password360", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash: hashedPassword,
      roleId: seededRoles["SUPER_ADMIN"].id,
      status: "ACTIVE"
    }
  });

  console.log(`Default Super Admin created: ${superAdmin.email} (password: password360)`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
