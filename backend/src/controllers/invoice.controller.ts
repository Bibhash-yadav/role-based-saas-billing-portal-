import { Request, Response } from "express";
import prisma from "../config/db";

export const createInvoice = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customerName,
      customerEmail,
      amount,
      dueDate,
    } = req.body;

    const invoice =
      await prisma.invoice.create({
        data: {
          customerName,
          customerEmail,
          amount: Number(amount),
          dueDate: new Date(dueDate),
        },
      });

    return res.status(201).json({
      success: true,
      invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create invoice",
    });
  }
};

export const getInvoices = async (
  req: Request,
  res: Response
) => {
  try {
    const invoices =
      await prisma.invoice.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};

export const getInvoiceById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const invoice =
      await prisma.invoice.findUnique({
        where: { id },
      });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateInvoice = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const invoice =
      await prisma.invoice.update({
        where: { id },
        data: req.body,
      });

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

export const deleteInvoice = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    await prisma.invoice.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Invoice deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};