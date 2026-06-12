import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/jwt";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const validRoles = [
      "OWNER",
      "BILLING_ADMIN",
      "VIEWER",
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = generateToken(
      user.id,
      user.email,
      user.role
    );

    return res.status(201).json({
      success: true,
      message: "User registered",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // IMPORTANT
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message:
          "Selected role does not match account role",
      });
    }

    const token = generateToken(
      user.id,
      user.email,
      user.role
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const me = async (
  req: Request,
  res: Response
) => {
  try {
    const user =
      await prisma.user.findUnique({
        where: {
          id: (req as any).user?.id,
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};