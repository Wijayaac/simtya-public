import React from "react";

// parsing jwt for get the payload object

export default function Auth({ children }) {
  return (
    <main className="form-signin mt-5 pt-5">
      <style jsx>{`
        .bd-placeholder-img {
          font-size: 1.125rem;
          text-anchor: middle;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }

        body {
          height: 100%;
          display: flex;
          align-items: center;
          padding-top: 40px;
          padding-bottom: 40px;
          background-color: #f5f5f5;
        }

        @media (min-width: 768px) {
          .bd-placeholder-img-lg {
            font-size: 3.5rem;
          }
        }
      `}</style>
      {children}
    </main>
  );
}
