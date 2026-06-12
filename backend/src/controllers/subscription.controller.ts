import { Request, Response } from "express";
import prisma from "../config/db";

export const createSubscription = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customerName,
      customerEmail,
      plan,
      price,
      endDate,
    } = req.body;

    const subscription =
      await prisma.subscription.create({
        data: {
          customerName,
          customerEmail,
          plan,
          price: Number(price),
          endDate: new Date(endDate),
        },
      });

    return res.status(201).json({
      success: true,
      subscription,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
};

export const getSubscriptions = async (
  req: Request,
  res: Response
) => {
  try {
    const subscriptions =
      await prisma.subscription.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions",
    });
  }
};

export const updateSubscription = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const subscription =
      await prisma.subscription.update({
        where: { id },
        data: req.body,
      });

    return res.status(200).json({
      success: true,
      subscription,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const deleteSubscription = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    await prisma.subscription.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Subscription deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};