import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const SummaryCard = ({ title, value, link }) => {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-orange-200 dark:border-orange-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Typography className="text-sm font-medium">{title}</Typography>
          <Bell className="h-4 w-4 text-orange-600 dark:text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">Active notices</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SummaryCard;
