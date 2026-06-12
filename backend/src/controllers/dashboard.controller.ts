import { Request, Response } from "express";
import prisma from "../config/db";

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalInvoices =
      await prisma.invoice.count();

    const paidInvoices =
      await prisma.invoice.count({
        where: {
          status: "PAID",
        },
      });

    const pendingInvoices =
      await prisma.invoice.count({
        where: {
          status: "PENDING",
        },
      });

    const activeSubscriptions =
      await prisma.subscription.count({
        where: {
          status: "ACTIVE",
        },
      });

    const revenueData =
      await prisma.invoice.findMany({
        where: {
          status: "PAID",
        },
        select: {
          amount: true,
        },
      });

    const totalRevenue =
      revenueData.reduce(
        (sum, invoice) =>
          sum + invoice.amount,
        0
      );

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        activeSubscriptions,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};