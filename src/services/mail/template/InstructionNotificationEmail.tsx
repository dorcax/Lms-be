import * as React from "react";

type InstructorEmailProps = {
  instructorName: string;
  studentName: string;
  courses: {
    title: string;
    price: number;
  }[];
  orderNumber: string;
};

export const InstructorNotificationEmail = ({
  instructorName,
  studentName,
  courses,
  orderNumber,
}: InstructorEmailProps) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>New Course Enrollment 🎉</h2>

      <p>Hello {instructorName},</p>

      <p>
        A student has just purchased one of your courses.
      </p>

      <p>
        <strong>Student:</strong> {studentName}
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

      <p style={{ marginTop: "20px" }}>
        The student is now enrolled in the course. You can view your instructor
        dashboard to track enrollments and engagement.
      </p>

      <p>
        Best regards,
        <br />
        LMS Team
      </p>
    </div>
  );
};