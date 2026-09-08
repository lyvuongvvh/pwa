import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { FrontPage } from './components/FrontPage';
import { DocumentArchive } from './components/DocumentArchive';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { NewsSection } from './components/NewsSection';
import { AboutSection } from './components/AboutSection';
import { ArticleEditorModal } from './components/ArticleEditorModal';
import { RoleManagementModal } from './components/RoleManagementModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ChuNomTranslator } from './components/ChuNomTranslator';
import { DocumentItem, ArticleItem } from './types';
import { INITIAL_DOCUMENTS, INITIAL_ARTICLES } from './data/seedData';
import { normalizeVietnameseText } from './utils/vietnameseTypography';
import { db } from './firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { Building, MapPin, Mail, Globe, ShieldCheck, Heart, Languages } from 'lucide-react';

const STORAGE_DOCS_KEY = 'viethoc_pwa_documents_v2';
const STORAGE_ARTICLES_KEY = 'viethoc_pwa_articles_v2';

function AppContent() {
  const { isEditor, isAdmin, user } = useAuth();

  // Navigation & Search State: 'home' | 'documents' | 'articles' | 'nom-translator' | 'about'
  const [activeTab, setActiveTab] = useState<'home' | 'documents' | 'articles' | 'nom-translator' | 'about'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State with resilient local caching
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_DOCS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // Fallback to seed data
    }
    return INITIAL_DOCUMENTS;
  });

  const [articles, setArticles] = useState<ArticleItem[]>(() => {
    const normalizeArticle = (art: ArticleItem): ArticleItem => ({
      ...art,
      title: normalizeVietnameseText(art.title),
      excerpt: normalizeVietnameseText(art.excerpt),
      content: normalizeVietnameseText(art.content),
    });

    try {
      const cached = localStorage.getItem(STORAGE_ARTICLES_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, ArticleItem>();
          INITIAL_ARTICLES.forEach((art) => map.set(art.id, normalizeArticle(art)));
          parsed.forEach((art: ArticleItem) => {
            if (!map.has(art.id)) {
              map.set(art.id, normalizeArticle(art));
            }
          });
          return Array.from(map.values());
        }
      }
    } catch {
      // Fallback to seed data
    }
    return INITIAL_ARTICLES.map(normalizeArticle);
  });

  // Modal States
  const [viewingDocument, setViewingDocument] = useState<DocumentItem | null>(null);
  const [highlightTerm, setHighlightTerm] = useState<string>('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<ArticleItem | null>(null);
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false);
  const [selectedArticleExternal, setSelectedArticleExternal] = useState<ArticleItem | null>(null);

  const handleOpenNewArticle = () => {
    setArticleToEdit(null);
    setIsNewArticleOpen(true);
  };

  const handleEditArticle = (article: ArticleItem) => {
    setArticleToEdit(article);
    setIsNewArticleOpen(true);
  };

  // Sync Documents with Firestore (and cache in localStorage for PWA offline operation)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'documents'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteDocs: DocumentItem[] = [];
          snapshot.forEach((d) => {
            const raw = d.data() as DocumentItem;
            remoteDocs.push({
              ...raw,
              title: normalizeVietnameseText(raw.title || ''),
              summary: raw.summary ? normalizeVietnameseText(raw.summary) : '',
              textContent: normalizeVietnameseText(raw.textContent || ''),
            });
          });
          // Merge with initial Vietnamese docs
          const mergedMap = new Map<string, DocumentItem>();
          INITIAL_DOCUMENTS.forEach((doc) =>
            mergedMap.set(doc.id, {
              ...doc,
              title: normalizeVietnameseText(doc.title),
              summary: doc.summary ? normalizeVietnameseText(doc.summary) : '',
              textContent: normalizeVietnameseText(doc.textContent),
            })
          );
          remoteDocs.forEach((doc) => mergedMap.set(doc.id, doc));

          const all = Array.from(mergedMap.values());
          setDocuments(all);
          try {
            localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(all));
          } catch {
            // LocalStorage quota safety
          }
        }
      },
      (error) => {
        console.warn('Firestore documents subscription (sử dụng bộ nhớ tạm):', error.message);
      }
    );

    return () => unsub();
  }, []);

  // Sync Articles with Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'articles'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteArticles: ArticleItem[] = [];
          snapshot.forEach((d) => {
            const raw = d.data() as ArticleItem;
            remoteArticles.push({
              ...raw,
              title: normalizeVietnameseText(raw.title || ''),
              excerpt: normalizeVietnameseText(raw.excerpt || ''),
              content: normalizeVietnameseText(raw.content || ''),
            });
          });

          const mergedMap = new Map<string, ArticleItem>();
          INITIAL_ARTICLES.forEach((art) =>
            mergedMap.set(art.id, {
              ...art,
              title: normalizeVietnameseText(art.title),
              excerpt: normalizeVietnameseText(art.excerpt),
              content: normalizeVietnameseText(art.content),
            })
          );
          remoteArticles.forEach((art) => mergedMap.set(art.id, art));

          const all = Array.from(mergedMap.values());
          setArticles(all);
          try {
            localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(all));
          } catch {
            // LocalStorage quota safety
          }
        }
      },
      (error) => {
        console.warn('Firestore articles subscription (sử dụng bộ nhớ tạm):', error.message);
      }
    );

    return () => unsub();
  }, []);

  const handleDocumentAdded = (newDoc: DocumentItem) => {
    setDocuments((prev) => {
      const updated = [newDoc, ...prev];
      try {
        localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleArticleCreated = (newArticle: ArticleItem) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === newArticle.id);
      const updated = exists
        ? prev.map((a) => (a.id === newArticle.id ? newArticle : a))
        : [newArticle, ...prev];
      try {
        localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Quý vị có chắc chắn muốn xóa tài liệu này khỏi kho lưu trữ?')) {
      try {
        await deleteDoc(doc(db, 'documents', id));
      } catch (err) {
        console.warn('Không thể xóa từ Firestore (xóa khỏi bộ nhớ cục bộ):', err);
      }
      setDocuments((prev) => {
        const updated = prev.filter((d) => d.id !== id);
        try {
          localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Quý vị có chắc chắn muốn xóa bài viết/thông báo này?')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch (err) {
        console.warn('Không thể xóa từ Firestore (xóa khỏi bộ nhớ cục bộ):', err);
      }
      setArticles((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        try {
          localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleLoadSeedArchives = async () => {
    setDocuments(INITIAL_DOCUMENTS);
    setArticles(INITIAL_ARTICLES);
    try {
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(INITIAL_DOCUMENTS));
      localStorage.setItem(STORAGE_ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
    } catch {}

    // Populate in Firestore if online
    for (const d of INITIAL_DOCUMENTS) {
      try {
        await setDoc(doc(db, 'documents', d.id), d);
      } catch {}
    }
    for (const a of INITIAL_ARTICLES) {
      try {
        await setDoc(doc(db, 'articles', a.id), a);
      } catch {}
    }
  };

  const handleOpenDocument = (docItem: DocumentItem, term?: string) => {
    setViewingDocument(docItem);
    setHighlightTerm(term || '');
  };

  const handleSelectArticleFromFrontPage = (article: ArticleItem) => {
    setSelectedArticleExternal(article);
    setActiveTab('articles');
  };

  const handleSaveChuNomAsDocument = async (docData: Partial<DocumentItem>) => {
    const newDoc: DocumentItem = {
      id: `doc-nom-${Date.now()}`,
      title: docData.title || 'Bản Dịch Chữ Nôm',
      fileName: docData.fileName || 'dich-chu-nom.txt',
      fileType: docData.fileType || 'text',
      fileSize: (docData.textContent?.length || 500) * 2,
      textContent: docData.textContent || '',
      summary: docData.summary || '',
      tags: docData.tags || ['Chữ Nôm', 'Dịch Thuật AI'],
      category: docData.category || 'Hán Nôm & Cổ Thư',
      authorId: user?.uid || 'researcher',
      authorEmail: user?.email || 'lyvuong@viethoc.com',
      authorName: user?.displayName || 'Viện Việt Học',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wordCount: (docData.textContent || '').trim().split(/\s+/).length,
    };

    handleDocumentAdded(newDoc);
    try {
      await setDoc(doc(db, 'documents', newDoc.id), newDoc);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[url('/viethoc-parchment-bg.jpg')] bg-fixed bg-cover bg-center text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Main Header & Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenNewArticle={() => setIsNewArticleOpen(true)}
        onOpenRoleManager={() => setIsRoleManagerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && (
          <FrontPage
            documents={documents}
            articles={articles}
            onNavigateTab={setActiveTab}
            onOpenDocument={handleOpenDocument}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenNewArticle={handleOpenNewArticle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectArticle={handleSelectArticleFromFrontPage}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentArchive
            documents={documents}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenDocument={handleOpenDocument}
            onDeleteDocument={handleDeleteDocument}
            onOpenUpload={() => setIsUploadOpen(true)}
            onLoadSeedArchives={handleLoadSeedArchives}
          />
        )}

        {activeTab === 'articles' && (
          <NewsSection
            articles={articles}
            onOpenNewArticle={handleOpenNewArticle}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
            selectedArticleExternal={selectedArticleExternal}
            onClearSelectedArticleExternal={() => setSelectedArticleExternal(null)}
          />
        )}

        {activeTab === 'nom-translator' && (
          <ChuNomTranslator
            onSaveAsDocument={handleSaveChuNomAsDocument}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* Modals */}
      {viewingDocument && (
        <DocumentViewerModal
          document={viewingDocument}
          initialHighlightQuery={highlightTerm}
          onClose={() => setViewingDocument(null)}
        />
      )}

      {isUploadOpen && (
        <DocumentUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onDocumentAdded={handleDocumentAdded}
        />
      )}

      {isNewArticleOpen && (
        <ArticleEditorModal
          isOpen={isNewArticleOpen}
          initialArticle={articleToEdit}
          onClose={() => {
            setIsNewArticleOpen(false);
            setArticleToEdit(null);
          }}
          onArticleCreated={handleArticleCreated}
        />
      )}

      {isRoleManagerOpen && (
        <RoleManagementModal
          isOpen={isRoleManagerOpen}
          onClose={() => setIsRoleManagerOpen(false)}
        />
      )}

      {/* Footer styled authentically for Viện Việt Học */}
      <footer className="relative overflow-hidden bg-[url('/viethoc-header-bg.png')] bg-cover bg-center text-amber-100/90 border-t border-amber-500/40 py-10 mt-12 text-xs shadow-xl">
        {/* Transparent dark scrim for text legibility without obscuring the viethoc background */}
        <div
          className="absolute inset-0 bg-black/25 pointer-events-none"
          aria-hidden="true"
        />
        {/* Subtle top gold accent highlight */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/15">
            <div className="flex items-center gap-3.5">
              <img
                src="/viethoc-logo.png"
                alt="Viện Việt Học Logo"
                className="h-11 w-auto object-contain drop-shadow-sm"
              />
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-wide font-sans">
                  VIỆN VIỆT HỌC &bull; INSTITUTE OF VIETNAMESE STUDIES
                </h3>
                <p className="text-[11px] text-amber-200/80">
                  Tổ chức bất vụ lợi thành lập ngày 26/02/2000 tại Westminster, California, Hoa Kỳ
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-amber-100/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>15355 Brookhurst St # 222, Westminster, CA 92683</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span>info@viethoc.org &bull; lyvuong@viethoc.com</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-amber-200/70">
            <p>
              &copy; {new Date().getFullYear()} Viện Việt Học. Bảo tồn và phát huy di sản văn hóa, ngôn ngữ và lịch sử Việt Nam.
            </p>
            <div className="flex items-center gap-4">
              <span>Chuẩn PWA Offline-First</span>
              <span>&bull;</span>
              <span>Đồng Bộ Firebase Firestore & Auth</span>
              <span>&bull;</span>
              <span>Phân Quyền RBAC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
