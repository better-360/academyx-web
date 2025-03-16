import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SurveyReportDetails() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
     
      const fetchReport = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
          // Fetch report data
        } catch (error) {
          console.error("Error fetching report:", error);
          setError("Report yüklenirken bir hata oluştu.");
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        if (id) {
            fetchReport(id);
        }
      }, [id]);
    return (
      <div>
        <h1>Survey Reports</h1>
      </div>
    );
  }