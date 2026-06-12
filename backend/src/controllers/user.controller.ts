import { Request, Response } from "express";
import prisma from "../config/db";

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const user =
      await prisma.user.findUnique({
        where: { id },
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
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const { role } = req.body;

    const validRoles = [
      "OWNER",
      "BILLING_ADMIN",
      "VIEWER",
    ];

    if (
      role &&
      !validRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user =
      await prisma.user.update({
        where: { id },
        data: {
          role,
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Role updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};