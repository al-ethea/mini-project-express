const bcrypt = require("bcrypt");
const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

// to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const artist = [
  { name: "Coldplay", category: "Pop" },
  { name: "Lady Gaga", category: "Pop" },
  { name: "Adele", category: "Pop" },
  { name: "Taylor Swift", category: "Pop" },
  { name: "Ed Sheeran", category: "Pop" },
  { name: "Bruno Mars", category: "R&B" },
  { name: "Billie Eilish", category: "Alternative" },
  { name: "Kendrick Lamar", category: "Hip-Hop" },
  { name: "The Weeknd", category: "R&B" },
  { name: "Dua Lipa", category: "Pop" },
  { name: "Bad Bunny", category: "Reggaeton" },
  { name: "Post Malone", category: "Hip-Hop" },
  { name: "Ariana Grande", category: "Pop" },
  { name: "Doja Cat", category: "Rap" },
  { name: "Imagine Dragons", category: "Alternative Rock" },
  { name: "Harry Styles", category: "Pop Rock" },
  { name: "Rihanna", category: "Pop" },
  { name: "Coldplay", category: "Alternative Rock" },
  { name: "SZA", category: "R&B" },
  { name: "Olivia Rodrigo", category: "Pop Rock" },
  { name: "Shakira", category: "Latin Pop" },
  { name: "Travis Scott", category: "Hip-Hop" },
  { name: "Lady Gaga", category: "Pop" },
  { name: "J Balvin", category: "Reggaeton" },
  { name: "Tyler, The Creator", category: "Hip-Hop" },
  { name: "Lizzo", category: "Pop" },
  { name: "Megan Thee Stallion", category: "Hip-Hop" },
  { name: "BLACKPINK", category: "K-Pop" },
  { name: "Shawn Mendes", category: "Pop" },
  { name: "Marshmello", category: "EDM" },
];

const users = [
  // {
  //   firstName: "Alice",
  //   lastName: "Johnson",
  //   email: "alice@example.com",
  //   postcode: "12345",
  //   password: "password123",
  //   role: "ATTENDEE",
  //   referralCode: "ALI123",
  //   totalPoints: 0,
  // },
  // {
  //   firstName: "Bob",
  //   lastName: "Smith",
  //   email: "bob@example.com",
  //   postcode: "54321",
  //   password: "secret456",
  //   role: "ORGANIZER",
  //   referralCode: "BOB456",
  //   totalPoints: 0,
  // },
  // {
  //   firstName: "Latriel",
  //   lastName: "Walker",
  //   email: "lateriel.walker@example.com",
  //   postcode: "10101",
  //   password: "password123",
  //   role: "ATTENDEE",
  //   referralCode: "LAT789",
  //   totalPoints: 0,
  // },
  // {
  //   firstName: "Benjamin",
  //   lastName: "Stone",
  //   email: "jigisoj435@harinv.com",
  //   postcode: "10202",
  //   password: "secure456",
  //   role: "ORGANIZER",
  //   referralCode: "BEN101",
  //   totalPoints: 0,
  // },
  // {
  //   firstName: "Carla",
  //   lastName: "Mitchell",
  //   email: "carla.m@example.com",
  //   postcode: "10303",
  //   password: "abc123xyz",
  //   role: "ATTENDEE",
  //   referralCode: "CAR202",
  //   totalPoints: 0,
  // },
  // {
  //   firstName: "Alex",
  //   lastName: "Johnson",
  //   postcode: "78965",
  //   email: "sosed84911@miracle3.com",
  //   password: "Pass123!",
  //   role: "ATTENDEE",
  //   referralCode: "QNI692",
  //   totalPoints: 0,
  // },
  // {
  //   firstName: "David",
  //   lastName: "Miller",
  //   postcode: "90210",
  //   email: "sowome1174@harinv.com",
  //   password: "SafePass789!",
  //   referralCode: "ZFB956",
  //   totalPoints: 0,
  // },
  {
    firstName: "Clara",
    lastName: "Mendez",
    email: "clara.mendez@example.com",
    postcode: "11223",
    password: "mypassword",
    role: "ATTENDEE",
    referralCode: "CLM789",
    totalPoints: 0,
  },
  {
    firstName: "David",
    lastName: "Lee",
    email: "david.lee@example.com",
    postcode: "99887",
    password: "pass321",
    role: "ATTENDEE",
    referralCode: "DAL101",
    totalPoints: 0,
  },
  {
    firstName: "Ella",
    lastName: "Nguyen",
    email: "ella.nguyen@example.com",
    postcode: "33445",
    password: "securepass",
    role: "ATTENDEE",
    referralCode: "ELN202",
    totalPoints: 0,
  },
  {
    firstName: "Frank",
    lastName: "O’Connor",
    email: "frank.oconnor@example.com",
    postcode: "22334",
    password: "letmein!",
    role: "ATTENDEE",
    referralCode: "FRO303",
    totalPoints: 0,
  },
  {
    firstName: "Grace",
    lastName: "Park",
    email: "grace.park@example.com",
    postcode: "55667",
    password: "gracepass",
    role: "ATTENDEE",
    referralCode: "GRP404",
    totalPoints: 0,
  },
  {
    firstName: "Ivy",
    lastName: "Chen",
    email: "ivy.chen@example.com",
    postcode: "77889",
    password: "ivychen321",
    role: "ATTENDEE",
    referralCode: "IVC606",
    totalPoints: 0,
  },
  {
    firstName: "Jack",
    lastName: "Thomas",
    email: "jack.thomas@example.com",
    postcode: "88990",
    password: "jacktheman",
    role: "ATTENDEE",
    referralCode: "JAT707",
    totalPoints: 0,
  },
  {
    firstName: "Karen",
    lastName: "Diaz",
    email: "karen.diaz@example.com",
    postcode: "99001",
    password: "karendzpass",
    role: "ATTENDEE",
    referralCode: "KAD808",
    totalPoints: 0,
  },
  {
    firstName: "Leo",
    lastName: "Morris",
    email: "leo.morris@example.com",
    postcode: "11112",
    password: "leopass789",
    role: "ATTENDEE",
    referralCode: "LEM909",
    totalPoints: 0,
  },
  {
    firstName: "Maya",
    lastName: "Patel",
    email: "maya.patel@example.com",
    postcode: "22223",
    password: "mayapass456",
    role: "ATTENDEE",
    referralCode: "MAP010",
    totalPoints: 0,
  },
  {
    firstName: "Nolan",
    lastName: "Scott",
    email: "nolan.scott@example.com",
    postcode: "33334",
    password: "nspass123",
    role: "ATTENDEE",
    referralCode: "NOS111",
    totalPoints: 0,
  },
  {
    firstName: "Olivia",
    lastName: "Turner",
    email: "olivia.turner@example.com",
    postcode: "44445",
    password: "olivpass321",
    role: "ATTENDEE",
    referralCode: "OLT212",
    totalPoints: 0,
  },
];

const event = [
  {
    name: "Coldplay Concert",
    city: "Jakarta",
    venue: "GBK Stadium",
    date: new Date("2024-11-15T19:00:00"),
    category: "Pop",
    price: 1500000,
    description: "Coldplay Music of the Spheres World Tour",
    availableSeats: 50000,
    type: "PAID",
    artistId: 1, // Pastikan ID artist sudah ada
    organizerProfileId: 1, // Pastikan ID organizer profile sudah ada
  },
  {
    name: "Lady Gaga",
    city: "Singapore",
    venue: "National Stadium",
    date: new Date("2024-09-20T15:00:00"),
    category: "Pop",
    price: 1000000,
    description: "Lady Gaga in Singapore",
    availableSeats: 10000,
    type: "PAID",
    artistId: 2,
    organizerProfileId: 1,
  },
];

const organizerProfile = [
  {
    companyName: "Star Events Co.",
    address: "123 Galaxy Avenue, New York, NY",
    phoneNumber: "+1-555-1234",
    verified: true,
  },
];

// async function main() {
//   artist.forEach(async (item) => {
//     await prisma.artist.create({
//       data: item,
//     });
//   });
//   user.forEach(async (item) => {
//     const hashed = await hashPassword(item.password);
//     await prisma.user.create({
//       data: item,
//       password: hashed,
//     });
//   });
// }

async function main() {
  for (const item of users) {
    const hashed = await hashPassword(item.password);
    await prisma.user.create({
      data: {
        ...item,
        password: hashed,
      },
    });
  }
  //   for (const item of artist) {
  //     await prisma.artist.create({
  //       data: item,
  //     });
  //   }
  //   for (const item of event) {
  //     await prisma.event.create({
  //       data: item,
  //     });
  //   }

  // for (const item of event) {
  //   await prisma.event.create({
  //     data: item,
  //   });
  // }
}

main()
  .catch((error) => {
    console.log(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
