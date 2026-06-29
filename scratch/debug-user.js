const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "deepakbawa0004@gmail.com" },
      include: { role: true }
    });

    if (!user) {
      console.log("DEBUG: User deepakbawa0004@gmail.com DOES NOT EXIST in the database!");
      return;
    }

    console.log("DEBUG: User Found:");
    console.log("- ID:", user.id);
    console.log("- Name:", user.name);
    console.log("- Email:", user.email);
    console.log("- Status:", user.status);
    console.log("- Role:", user.role?.name);
    console.log("- Has Password Hash:", !!user.passwordHash);
    console.log("- Password Hash Value:", user.passwordHash);

    // Let's test bcrypt compare of "Admin@123"
    const bcrypt = require("bcryptjs");
    const passwordsMatch = await bcrypt.compare("Admin@123", user.passwordHash);
    console.log("- Does 'Admin@123' match password hash:", passwordsMatch);
  } catch (error) {
    console.error("DEBUG Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
