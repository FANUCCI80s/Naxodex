import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
platformName: "NAXODEX",
logoUrl: null,
primaryColor: "#E8C766",
secondaryColor: "#FAF7F0",
accentColor: "#D4AF37",
};

function isValidHexColor(value: unknown): value is string {
return (
typeof value === "string" &&
/^#[0-9A-Fa-f]{6}$/.test(value)
);
}

export async function GET() {
try {
let settings = await prisma.platformSettings.findFirst({
orderBy: {
createdAt: "asc",
},
});


if (!settings) {
  settings = await prisma.platformSettings.create({
    data: DEFAULT_SETTINGS,
  });
}

return NextResponse.json({
  success: true,
  settings,
});


} catch (error) {
console.error("GET /api/admin/settings error:", error);


return NextResponse.json(
  {
    success: false,
    error: "Failed to load platform settings.",
  },
  {
    status: 500,
  }
);


}
}

export async function PATCH(request: Request) {
try {
const body = await request.json();


const platformName =
  typeof body.platformName === "string"
    ? body.platformName.trim()
    : "";

const logoUrl =
  body.logoUrl === null ||
  body.logoUrl === undefined ||
  body.logoUrl === ""
    ? null
    : typeof body.logoUrl === "string"
      ? body.logoUrl.trim()
      : null;

const primaryColor = body.primaryColor;
const secondaryColor = body.secondaryColor;
const accentColor = body.accentColor;

if (!platformName) {
  return NextResponse.json(
    {
      success: false,
      error: "Platform name is required.",
    },
    {
      status: 400,
    }
  );
}

if (platformName.length > 100) {
  return NextResponse.json(
    {
      success: false,
      error: "Platform name must be 100 characters or fewer.",
    },
    {
      status: 400,
    }
  );
}

if (!isValidHexColor(primaryColor)) {
  return NextResponse.json(
    {
      success: false,
      error: "Primary color must be a valid hex color.",
    },
    {
      status: 400,
    }
  );
}

if (!isValidHexColor(secondaryColor)) {
  return NextResponse.json(
    {
      success: false,
      error: "Secondary color must be a valid hex color.",
    },
    {
      status: 400,
    }
  );
}

if (!isValidHexColor(accentColor)) {
  return NextResponse.json(
    {
      success: false,
      error: "Accent color must be a valid hex color.",
    },
    {
      status: 400,
    }
  );
}

let existing = await prisma.platformSettings.findFirst({
  orderBy: {
    createdAt: "asc",
  },
});

if (!existing) {
  existing = await prisma.platformSettings.create({
    data: DEFAULT_SETTINGS,
  });
}

const settings = await prisma.platformSettings.update({
  where: {
    id: existing.id,
  },
  data: {
    platformName,
    logoUrl,
    primaryColor,
    secondaryColor,
    accentColor,
  },
});

return NextResponse.json({
  success: true,
  settings,
});


} catch (error) {
console.error("PATCH /api/admin/settings error:", error);


if (error instanceof SyntaxError) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid JSON request.",
    },
    {
      status: 400,
    }
  );
}

return NextResponse.json(
  {
    success: false,
    error: "Failed to save platform settings.",
  },
  {
    status: 500,
  }
);


}
}
