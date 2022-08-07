import { Record } from "@prisma/client";
import prisma from "../lib/prisma";

export const Records = ({ records }: { records: Record[] }) => {
  return (
    <table>
      <th>date</th>
      <th>time</th>
      {records.map((record) => {
        return (
          <tr key={record.id}>
            <td style={{ border: "1px solid black" }}>{record.dateTime}</td>
            <td style={{ border: "1px solid black" }}>{record.time}</td>
          </tr>
        );
      })}
    </table>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
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
}

export default Records;
