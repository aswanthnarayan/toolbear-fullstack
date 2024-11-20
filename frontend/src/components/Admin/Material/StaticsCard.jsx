import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function StaticsCard({ title, value, percentage }) {
  return (
    <Card className="mt-6 w-60 h-52">
      <CardBody className="flex flex-col items-center justify-center space-y-2 my-auto">
        <Typography variant="h5" color="blue-gray" className="text-center">
          {title}
        </Typography>
        <Typography variant="h2" className="text-center">
          {value}
        </Typography>
        <Typography variant="h6" color="blue-gray" className="text-center">
          {percentage}
        </Typography>
      </CardBody>
    </Card>
  );
}