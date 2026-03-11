import * as React from "react";

type OrderEmailProps = {
  studentName: string;
  orderNumber: string;
  courses: {
    title: string;
    price: number;
  }[];
  totalAmount: number;
};

export const StudentOrderEmail = ({
  studentName,
  orderNumber,
  courses,
  totalAmount,
}: OrderEmailProps) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>Order Confirmation</h2>

      <p>Hello {studentName},</p>

      <p>
        Your payment was successful. Your order has been confirmed.
      </p>

      <p>
        <strong>Order Number:</strong> {orderNumber}
      </p>

      <h3>Courses Purchased</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
              Course
            </th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
              Price
            </th>
          </tr>
        </thead>

        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td style={{ padding: "8px 0" }}>{course.title}</td>
              <td style={{ padding: "8px 0" }}>₦{course.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total Paid: ₦{totalAmount}</h3>

      <p style={{ marginTop: "20px" }}>
        You now have access to your courses. Start learning anytime.
      </p>

      <p>
        Happy learning! <br />
        LMS Team
      </p>
    </div>
  );
};