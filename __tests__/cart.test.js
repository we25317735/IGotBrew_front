import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Order from "../pages/cart/order/index";
import { useRouter } from "next/router";
import axios from "axios";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("Order 表單流程", () => {
  it("完整流程：填寫資料 → 選配送 → 選付款 → 填信用卡 → 結帳", async () => {
    render(<Order />);

    // ---- 基本資料 ----
    fireEvent.change(screen.getByPlaceholderText("請輸入姓名"), { target: { value: "林俊成" } });
    fireEvent.change(screen.getByPlaceholderText("請輸入電話號碼"), { target: { value: "0922887778" } });
    fireEvent.change(screen.getByPlaceholderText("請輸入電子信箱"), { target: { value: "we25317735@gmail.com" } });

    // ---- 配送方式 ----
    fireEvent.click(screen.getByLabelText("超商取貨"));
    fireEvent.change(screen.getByPlaceholderText("門市號碼"), { target: { value: "122360" } });
    fireEvent.change(screen.getByPlaceholderText("門市名稱"), { target: { value: "三芝門市" } });

    // ---- 付款方式 ----
    fireEvent.click(screen.getByLabelText("信用卡支付"));
    fireEvent.change(screen.getByPlaceholderText("請輸入卡號"), { target: { value: "4111111111111111" } });
    fireEvent.change(screen.getByPlaceholderText("請輸入持卡人姓名"), { target: { value: "LIN JUN CHENG" } });
    fireEvent.change(screen.getByPlaceholderText("請輸入有效日期"), { target: { value: "12/29" } });
    fireEvent.change(screen.getByPlaceholderText("請輸入安全碼"), { target: { value: "123" } });

    // ---- 發票資訊 ----
    fireEvent.click(screen.getByLabelText("發票捐贈"));

    // ---- 勾選服務條款 ----
    fireEvent.click(screen.getByLabelText("我同意接受服務條款及隱私權政策。"));

    // ---- 按下「結帳」 ----
    fireEvent.click(screen.getByRole("button", { name: "結帳" }));

    // 驗證 API 有被呼叫
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/cart/create"),
        expect.objectContaining({
          ship_method: "超商取貨",
          pay_method: "信用卡",
          bill_type: "發票捐贈",
        })
      );
    });

    // 驗證路由跳轉
    expect(pushMock).toHaveBeenCalledWith("/cart/orderComple?transaction_id=T12345");
  });
});
