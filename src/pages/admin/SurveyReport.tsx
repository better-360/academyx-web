import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../http/instance";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './../../surveyReport.css'; // Markdown stillemesi için CSS dosyası


export default function SurveyReportDetails() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/admin/reports/${id}`);
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        setError('Rapor yüklenirken bir hata oluştu');
        setLoading(false);
        console.error('Rapor yükleme hatası:', err);
      }
    };

    fetchReport();
  }, [id]);

  

  if (loading) return <div className="loading">Rapor yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!report) return <div className="not-found">Rapor bulunamadı</div>;

  const markdownContent = report.report?.content || '';

    return (
    <div className="survey-report-container">
      <h1>İletişim Anketi Raporu</h1>
      <div className="report-metadata">
        <p>Oluşturulma: {new Date(report.report?.generatedAt).toLocaleString()}</p>
        <button 
  className="print-button" 
  onClick={() => window.print()}
>
  Raporu Yazdır
</button>
      </div>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} 
          children={markdownContent}
          components={{
            // Tablolar için özel stil
            table: ({node, ...props}) => (
              <div className="table-container">
                <table className="markdown-table" {...props} />
              </div>
            )
          }}
        />
      </div>
    </div>
  );
  }