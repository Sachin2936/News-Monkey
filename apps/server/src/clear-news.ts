import prisma from "@News-Monkey/db";
async function clear() {
    const res = await prisma.newsArticle.deleteMany({});
    console.log(`Deleted ${res.count} articles`);
}
clear().then(() => process.exit(0));
