import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();

  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) return new Response("Missing secret", { status: 500 });

  const svix = new Webhook(secret);

  let event: any;
  try {
    event = svix.verify(payload, {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get("svix-timestamp")!,
      "svix-signature": headerPayload.get("svix-signature")!,
    });
  } catch (err) {
    console.error("Webhook verification failed", err);
    return new NextResponse("Invalid", { status: 400 });
  }

  // const { id, email_addresses, created_at } = event.data;
  // const email = email_addresses[0]?.email_address || "unknown@example.com";

  // await prisma.user.upsert({
  //   where: { id },
  //   update: {},
  //   create: {
  //     id,
  //     email,
  //     createdAt: new Date(created_at),
  //   },
  // });

  if (event.type === "user.created") {
    const { id, first_name, last_name, created_at } = event.data;
    const email =
      event.data.email_addresses[0]?.email_address || "unknown@example.com";

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    // const user = await prisma.user.upsert({
    //   where: { id },
    //   update: {},
    //   create: {
    //     id,
    //     email,
    //     name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
    //     createdAt: new Date(created_at),
    //   },
    // });
    // console.log("USER:", user);

    if (existingUser) {
      // If user exists, update if necessary
      const user = await prisma.user.update({
        where: { email },
        data: {
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        },
      });
      console.log("Updated user:", user);
    } else {
      // If user doesn't exist, create a new one
      const user = await prisma.user.create({
        data: {
          id,
          email,
          name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
          createdAt: new Date(created_at),
        },
      });
      console.log("Created user:", user);
    }
  }
  return NextResponse.json({ success: true });
}
