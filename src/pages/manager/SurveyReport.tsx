import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../http/instance";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import './../../surveyReport.css';

// Icon bileşenleri
const PrintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const LoadingSpinner = () => (
  <div className="loading">
    <div className="loading-spinner"></div>
    <p>Rapor yükleniyor...</p>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="error">
    <div className="error-icon">⚠️</div>
    <h2>Hata Oluştu</h2>
    <p>{message}</p>
  </div>
);

const NotFoundDisplay = () => (
  <div className="not-found">
    <div className="not-found-icon">🔍</div>
    <h2>Rapor Bulunamadı</h2>
    <p>Aradığınız rapor bulunamadı veya erişim izniniz yok.</p>
  </div>
);

// TOC oluşturmak için özel bileşen
const TableOfContents = ({ content }: { content: string }) => {
  // Başlıkları bulmak için basit bir regex
  const headings = content.match(/#{1,3} .+/g) || [];
  
  return (
    <div className="toc-container">
      <h3 className="toc-title">İçindekiler</h3>
      <ul className="toc-list">
        {headings.map((heading, index) => {
          // Başlık seviyesini ve içeriğini çıkar
          const level = heading.match(/^#+/)?.[0].length || 1;
          const title = heading.replace(/^#+\s+/, '');
          
          // Anchor değerini oluştur (başlık metnini küçük harfe çevir, türkçe karakterleri ingilizceye çevir, ve boşlukları tire ile değiştir)
          const anchor = title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[\s.,/#!$%^&*;:{}=\-_`~()]/g, '-')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');
          
          return (
            <li key={index} className={`toc-h${level}`}>
              <a href={`#${anchor}`}>{title}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Belirli bir metnin yüzde değerini gösteren görsel bileşen
const PercentageBar = ({ value }: { value: number }) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className="percentage-bar">
      <div className="fill" style={{ width: `${clampedValue}%` }}></div>
    </div>
  );
};

export default function ManagerSurveyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/admin/reports/${id}`);
        console.log('Rapor:', response.data);
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

  // Rapor içeriğini yazdırmak için kullanılacak fonksiyon
  const handlePrint = () => {
    window.print();
  };

  // Markdown içeriğindeki başlıkları işlemek için
  const processContent = (content: string) => {
    return content;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!report) return <NotFoundDisplay />;

  const markdownContent = report.report?.content || '';
  const processedContent = processContent(markdownContent);
  const reportDate = new Date(report.report?.generatedAt).toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="survey-report-container">
      <div className="report-header">
        <h1>Better Pazarlama Anketi Analiz ve Değerlendirme Raporu</h1>
        <p className="subtitle">Müşteri memnuniyeti ve pazarlama stratejilerinin kapsamlı analizi</p>
      </div>

      <div className="report-metadata">
        <div className="report-date">
          <CalendarIcon /> <span>Oluşturulma: {reportDate}</span>
        </div>
        <button className="print-button no-print" onClick={handlePrint}>
          <PrintIcon /> Raporu Yazdır
        </button>
      </div>

      <div className="markdown-content" ref={contentRef}>
        {/* İçindekiler tablosu */}
        <TableOfContents content={processedContent} />

        {/* Markdown içeriği */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          children={processedContent}
          components={{
            // Başlıklar için özel stil ve ID'ler
            h1: ({ node, ...props }) => <h1 id={props.id} {...props} />,
            h2: ({ node, ...props }) => <h2 id={props.id} {...props} />,
            h3: ({ node, ...props }) => <h3 id={props.id} {...props} />,
            
            // Tablolar için özel stil
            table: ({ node, ...props }) => (
              <div className="table-container">
                <table className="markdown-table" {...props} />
              </div>
            ),
            
            // Vurgulanmış içerikler için özel stil
            blockquote: ({ node, ...props }) => (
              <blockquote className="info-box" {...props} />
            ),
            
            // İçerik içinde %65 gibi yüzdelik ifadeleri bulup görselleştirme
            p: ({ node, children, ...props }) => {
              const content = String(children);
              
              // Yüzde ifadeleri içeren metinleri bul
              const percentageRegex = /(\d+)%/g;
              const matches = content.match(percentageRegex);
              
              if (matches) {
                let processedContent = content;
                matches.forEach(match => {
                  const percentage = parseInt(match.replace('%', ''));
                  processedContent = processedContent.replace(
                    match,
                    `<span class="highlight">${match}</span>`
                  );
                });
                
                return <p {...props} dangerouslySetInnerHTML={{ __html: processedContent }} />;
              }
              
              return <p {...props}>{children}</p>;
            }
          }}
        />
      </div>
    </div>
  );
}