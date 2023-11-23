import { Record } from "@prisma/client";
import prisma from "../lib/prisma";

const Records = ({ records, error }: { records: Record[]; error: string }) => {
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <table className="record_table">
      <tr className="record_table__header">
        <th className="record_table__cell">date</th>
        <th className="record_table__cell">time</th>
      </tr>

      {records.map((record) => {
        return (
          <tr key={record.id}>
            <td className="record_table__cell">{record.dateTime}</td>
            <td className="record_table__cell">{record.time}</td>
          </tr>
        );
      })}
      <style jsx>{`
        .record_table {
          margin: 2rem auto;
          border: 1px solid #efefef;
          border-radius: 10px;
        }
        .record_table__header {
          background: #e9e9e9;
          text-align: center;
          font-weight: bold;
        }
        .record_table__cell {
          padding: 0.5rem 1rem;
        }
      `}</style>
    </table>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  try {
    const records = await prisma.record.findMany({
      where: { userId: 1 },
    });
    // Pass data to the page via props
    return {
      props: {
        records: records.map((record) => ({
          ...record,
          createdAt: record.createdAt?.toISOString(),
          updatedAt: record.updatedAt?.toISOString(),
          dateTime: `${record.dateTime?.toLocaleDateString()} ${record.dateTime?.toLocaleTimeString()}`,
          time: `${new Date(record.time).getHours()}:${new Date(
            record.time
          ).getMinutes()}:${new Date(record.time).getSeconds()}`,
        })),
      },
    };
  } catch (error) {
    return { props: { error: `error while fetching the records` } };
  }
}

export default Records;
