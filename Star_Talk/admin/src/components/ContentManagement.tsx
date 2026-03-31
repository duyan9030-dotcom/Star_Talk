import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Volume2 } from 'lucide-react';

// Interfaces for backend data structures
interface WordVO {
  id: number;
  word: string; // English word (对应后端 word)
  meaning: string; // Chinese definition (对应后端 meaning)
  phonetic: string; // Standard pronunciation (e.g., audio URL or phonetic) (对应后端 phonetic)
  exampleSentence: string; // Example sentence (对应后端 exampleSentence)
  category: string;
  difficulty: number;
  phoneticAudio?: string; // 后端可能有的发音音频链接
  partOfSpeech?: string; // 后端可能有的词性
  exampleTranslation?: string; // 后端可能有的例句翻译
  exampleAudio?: string; // 后端可能有的例句音频链接
  imageUrl?: string; // 后端可能有的图片链接
  createTime?: string;
  updateTime?: string;
}

interface PageVO<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

interface Result<T> {
  code: number;
  msg: string;
  data: T;
}

type Void = Record<string, never>;

export default function ContentManagement() {
  const [words, setWords] = useState<WordVO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingWord, setEditingWord] = useState<WordVO | null>(null); // New state for editing word

  const fetchWords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming backend is running on http://localhost:8080 or similar
      const response = await fetch(
        `/admin/word/list?pageNum=${currentPage}&pageSize=${pageSize}&keyword=${searchKeyword}`,
        {
          headers: {
            // Assuming a token is needed for authorization
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonResponse: Result<PageVO<WordVO>> = await response.json();
      if (jsonResponse.code === 200) {
        setWords(jsonResponse.data.records);
        setTotalWords(jsonResponse.data.total);
      } else {
        setError(jsonResponse.msg);
      }
    } catch (e: any) {
      setError(`Failed to fetch words: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateDummyWords = (count: number): WordVO[] => {
    const dummyWords: WordVO[] = [];
    for (let i = 1; i <= count; i++) {
      dummyWords.push({
        id: i,
        word: `Word${i}`,
        meaning: `含义${i}`,
        phonetic: `/fəˈnɛtɪk${i}/`,
        exampleSentence: `This is an example sentence for Word${i}.`,
        category: `Category${i % 5}`,
        difficulty: (i % 10) + 1,
        phoneticAudio: `http://example.com/audio/word${i}.mp3`,
        partOfSpeech: `n.`,
        exampleTranslation: `这是单词${i}的例句.`,
        exampleAudio: `http://example.com/audio/sentence${i}.mp3`,
        imageUrl: `http://example.com/image/word${i}.jpg`,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      });
    }
    return dummyWords;
  };

  useEffect(() => {
    // fetchWords(); // Comment out to use dummy data
    const dummyData = generateDummyWords(117);
    setWords(dummyData.slice((currentPage - 1) * pageSize, currentPage * pageSize));
    setTotalWords(dummyData.length);
    setLoading(false);
  }, [currentPage, pageSize, searchKeyword]); // Re-fetch when page, size or keyword changes

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleAddWordClick = () => {
    setEditingWord(null); // Clear editing word when adding new
    setIsModalOpen(true);
  };

  const handleEditWordClick = (word: WordVO) => {
    setEditingWord(word); // Set the word to be edited
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWord(null); // Clear editing word after closing modal
    fetchWords(); // Refresh list after modal closes (e.g., after adding or editing a word)
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除此单词吗？')) {
      return;
    }
    try {
      const response = await fetch(`/admin/word/${id}`, {
        method: 'DELETE',
        headers: {
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonResponse: Result<Void> = await response.json();
      if (jsonResponse.code === 200) {
        fetchWords(); // Refresh the list after successful deletion
      } else {
        alert(`删除失败: ${jsonResponse.msg}`);
      }
    } catch (e: any) {
      alert(`删除失败: ${e.message}`);
    }
  };



  // Placeholder for Add/Edit Word Modal component
  const WordFormModal = ({ isOpen, onClose, initialWord }: { isOpen: boolean; onClose: () => void; initialWord: WordVO | null }) => {
    const [wordFormData, setWordFormData] = useState<Omit<WordVO, 'id'> | WordVO>(initialWord ? { ...initialWord, id: initialWord.id } : {
      word: '',
      meaning: '',
      phonetic: '',
      exampleSentence: '',
      category: '',
      difficulty: 0,
      phoneticAudio: '',
      partOfSpeech: '',
      exampleTranslation: '',
      exampleAudio: '',
      imageUrl: '',
    });
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
      if (isOpen) {
        setWordFormData(initialWord ? { ...initialWord, id: initialWord.id } : {
          word: '',
          meaning: '',
          phonetic: '',
          exampleSentence: '',
          category: '',
          difficulty: 0,
          phoneticAudio: '',
          partOfSpeech: '',
          exampleTranslation: '',
          exampleAudio: '',
          imageUrl: '',
        });
        setSubmitError(null);
      }
    }, [isOpen, initialWord]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setWordFormData((prev) => ({
        ...prev,
        [name]: name === 'difficulty' ? parseInt(value) : value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      setIsSubmitting(true);

      // Basic validation
      if (!wordFormData.word || !wordFormData.meaning || !wordFormData.category || wordFormData.difficulty === undefined) {
        setSubmitError('英文单词、中文释义、分类和难度为必填项。');
        setIsSubmitting(false);
        return;
      }

      try {
        const method = initialWord ? 'PUT' : 'POST';
        const url = initialWord ? `/admin/word/${initialWord.id}` : '/admin/word';
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(wordFormData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: Result<Void> = await response.json();
        if (jsonResponse.code === 200) {
          onClose(); // Close modal and trigger fetchWords in parent
        } else {
          setSubmitError(jsonResponse.msg);
        }
      } catch (e: any) {
        setSubmitError(`Failed to ${initialWord ? 'update' : 'add'} word: ${e.message}`);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{initialWord ? '编辑单词' : '新增单词'}</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="word" className="block text-sm font-medium text-gray-700 text-left">英文单词</label>
                <input type="text" name="word" id="word" value={wordFormData.word} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 text-left">中文释义</label>
                <input type="text" name="meaning" id="meaning" value={wordFormData.meaning} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="phonetic" className="block text-sm font-medium text-gray-700 text-left">音标</label>
                <input type="text" name="phonetic" id="phonetic" value={wordFormData.phonetic} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="phoneticAudio" className="block text-sm font-medium text-gray-700 text-left">标准发音 (URL)</label>
                <input type="text" name="phoneticAudio" id="phoneticAudio" value={wordFormData.phoneticAudio || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="exampleSentence" className="block text-sm font-medium text-gray-700 text-left">例句</label>
                <textarea name="exampleSentence" id="exampleSentence" value={wordFormData.exampleSentence} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label htmlFor="exampleTranslation" className="block text-sm font-medium text-gray-700 text-left">例句翻译</label>
                <textarea name="exampleTranslation" id="exampleTranslation" value={wordFormData.exampleTranslation || ''} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 text-left">分类</label>
                <input type="text" name="category" id="category" value={wordFormData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 text-left">难度 (0-10)</label>
                <input type="number" name="difficulty" id="difficulty" value={wordFormData.difficulty} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" min="0" max="10" />
              </div>

              {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : (initialWord ? '保存' : '新增')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">错误: {error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">词库资源管理</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索单词..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
          </div>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-700"
            onClick={handleAddWordClick}
          >
            <Plus className="w-4 h-4 mr-1" /> 新增单词
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">单词 (EN)</th>
              <th className="p-4 font-medium">中文释义</th>
              <th className="p-4 font-medium">音标</th>
              <th className="p-4 font-medium">标准发音</th>
              <th className="p-4 font-medium">例句</th>
              <th className="p-4 font-medium">例句翻译</th>
              <th className="p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {words.map((word) => (
              <tr key={word.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-800">{word.word}</td>
                <td className="p-4 text-gray-600">{word.meaning}</td>
                <td className="p-4 text-gray-600">{word.phonetic}</td>
                <td className="p-4">
                  {word.phoneticAudio && (
                    <button className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
                <td className="p-4 text-gray-500 italic">{word.exampleSentence}</td>
                <td className="p-4 text-gray-500 italic">{word.exampleTranslation}</td>
                <td className="p-4 flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-blue-600"
                    onClick={() => handleEditWordClick(word)}
                  ><Edit className="w-4 h-4" /></button>
                  <button 
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleDelete(word.id)}
                  ><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Basic Pagination */}
      <div className="p-6 flex justify-end items-center space-x-2 border-t border-gray-100">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
        >
          上一页
        </button>
        <span className="text-sm text-gray-700">
          页 {currentPage} / {Math.ceil(totalWords / pageSize)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * pageSize >= totalWords}
          className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
        >
          下一页
        </button>
      </div>
      <WordFormModal isOpen={isModalOpen} onClose={handleCloseModal} initialWord={editingWord} />
    </div>
  );
}

