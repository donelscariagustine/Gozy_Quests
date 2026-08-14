import React, { useState } from 'react';
import { ProjectFolder, ProjectSubtask } from '../types/todo';
import { X, Plus, CheckCircle, Trash2, Pin, Copy, Check, FileText, ListTodo, Edit3, Eye, Sparkles, Trophy } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProjectWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectFolder | null;
  onAddSubtask: (projectId: string, title: string) => void;
  onToggleSubtask: (projectId: string, subtaskId: string) => void;
  onDeleteSubtask: (projectId: string, subtaskId: string) => void;
  onPushSubtaskToQuestboard: (projectId: string, subtask: ProjectSubtask) => void;
  onUpdateNotes: (projectId: string, notes: string) => void;
  onCompleteProjectFolder?: (projectId: string) => void;
}

const parseBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-black text-white bg-indigo-950/60 px-1 py-0.5 rounded border border-indigo-500/30">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const renderFormattedMarkdown = (content: string) => {
  if (!content || !content.trim()) {
    return <p className="text-slate-500 italic text-xs">No notes written yet. Switch to Edit mode to write developer notes!</p>;
  }

  const lines = content.split('\n');
  return (
    <div className="space-y-2 p-4 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-slate-100 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl sm:text-2xl font-black text-amber-400 border-b-2 border-slate-700 pb-1 mt-4 mb-2">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-lg font-black text-indigo-300 border-b border-slate-800 pb-0.5 mt-3 mb-1.5">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base font-black text-emerald-400 mt-2 mb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-200 ml-2 my-1">
              <span className="text-indigo-400 font-bold">•</span>
              <span>{parseBoldText(itemText)}</span>
            </div>
          );
        }
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }
        return (
          <p key={idx} className="text-xs font-medium text-slate-300 leading-relaxed">
            {parseBoldText(line)}
          </p>
        );
      })}
    </div>
  );
};

export const ProjectWorkspaceModal: React.FC<ProjectWorkspaceModalProps> = ({
  isOpen,
  onClose,
  project,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onPushSubtaskToQuestboard,
  onUpdateNotes,
  onCompleteProjectFolder,
}) => {
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'subtasks' | 'notes'>('subtasks');
  const [notesViewMode, setNotesViewMode] = useState<'preview' | 'edit'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const allSubtasksDone = project.subtasks.length > 0 && project.subtasks.every((st) => st.completed);

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;

    sounds.playPop();
    onAddSubtask(project.id, subtaskTitle.trim());
    setSubtaskTitle('');
  };

  const handleCopyNotes = () => {
    sounds.playPop();
    navigator.clipboard.writeText(project.notes || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-pop-in">
      <div className="card-cozy w-full max-w-4xl p-6 bg-[#0f172a] text-slate-100 border-4 border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
        {/* Top Header & Complete Project Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            {/* Physical Folder Colored Tab */}
            <div
              className="w-12 h-12 rounded-2xl border-3 border-slate-800 flex items-center justify-center text-2xl shadow-chunky-sm shrink-0"
              style={{ backgroundColor: project.colorTag }}
            >
              📁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{project.name}</h2>
                <span className="rounded-xl border border-slate-700 bg-[#1e293b] px-2.5 py-0.5 text-xs font-black uppercase text-indigo-300">
                  {project.category}
                </span>
                {project.completed && (
                  <span className="rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                <span>📅 Deadline: {project.targetDeadline}</span>
                <span>•</span>
                <span>Subtasks: {project.subtasks.filter((s) => s.completed).length}/{project.subtasks.length} Done</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* COMPLETE PROJECT FOLDER BUTTON */}
            {onCompleteProjectFolder && !project.completed && (
              <button
                type="button"
                onClick={() => {
                  onCompleteProjectFolder(project.id);
                }}
                className={`btn-tactile px-4 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  allSubtasksDone
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 animate-bounce-subtle'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{allSubtasksDone ? '✅ Complete Project Folder (+100 XP)' : 'Mark Completed'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Overview Box */}
        <div className="rounded-2xl border-2 border-slate-800 bg-[#1e293b] p-4 text-xs text-slate-300 font-medium leading-relaxed">
          <span className="font-black text-amber-400 uppercase tracking-wider block mb-1">
            📌 Project Overview Details
          </span>
          {project.overview}
        </div>

        {/* Navigation Tabs (Subquests vs Notebook) */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setActiveTab('subtasks');
              }}
              className={`px-4 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'subtasks'
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ListTodo className="w-4 h-4" /> 📋 Subquests Manager ({project.subtasks.length})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setActiveTab('notes');
              }}
              className={`px-4 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" /> 📝 Project Notebook
            </button>
          </div>
        </div>

        {/* TAB 1: WORK LIST & SUBQUESTS MANAGER */}
        {activeTab === 'subtasks' && (
          <div className="space-y-4">
            {/* Add Subtask Form (Focus Timer Removed per user request) */}
            <form onSubmit={handleAddSubtaskSubmit} className="flex gap-2">
              <input
                type="text"
                required
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="Add sub-task step (e.g., Build API Authentication)..."
                className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-white font-bold text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="btn-tactile bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-xs px-5 py-2.5 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-chunky-sm"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Step
              </button>
            </form>

            {/* Subtasks List */}
            <div className="space-y-2.5">
              {project.subtasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-bold rounded-2xl border-2 border-dashed border-slate-800">
                  No subquests created yet. Add your first step above!
                </div>
              ) : (
                project.subtasks.map((st) => (
                  <div
                    key={st.id}
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                      st.completed
                        ? 'border-slate-800 bg-[#1e293b]/50 opacity-60'
                        : 'border-slate-700 bg-[#1e293b] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          onToggleSubtask(project.id, st.id);
                        }}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${
                          st.completed
                            ? 'border-emerald-500 bg-emerald-500 text-slate-900'
                            : 'border-slate-600 bg-[#0f172a] hover:border-emerald-400'
                        }`}
                      >
                        {st.completed && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                      </button>

                      <span
                        className={`text-xs font-black truncate flex-1 min-w-0 ${
                          st.completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>

                    {/* Actions: Push to Questboard & Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!st.completed && (
                        <button
                          type="button"
                          disabled={st.pushedToQuestboard}
                          onClick={() => {
                            sounds.playLevelUp();
                            onPushSubtaskToQuestboard(project.id, st);
                          }}
                          className={`px-3 py-1.5 rounded-xl border-2 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all ${
                            st.pushedToQuestboard
                              ? 'border-indigo-500/40 bg-indigo-600/30 text-indigo-300 opacity-80'
                              : 'border-amber-500 bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm'
                          }`}
                          title="Push directly to main Quest Board"
                        >
                          <Pin className="w-3 h-3" />
                          <span>{st.pushedToQuestboard ? 'Pushed to Board' : '📌 Push to Questboard'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          onDeleteSubtask(project.id, st.id);
                        }}
                        className="p-1.5 rounded-xl border-2 border-slate-700 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                        title="Delete Subtask"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT DEVELOPER NOTEBOOK WITH LIVE MARKDOWN RENDERER */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Developer Notebook
                </label>

                {/* Edit vs Live Preview Toggle */}
                <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setNotesViewMode('preview');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                      notesViewMode === 'preview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3" /> 👁️ Formatted Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setNotesViewMode('edit');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                      notesViewMode === 'edit'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" /> ✏️ Edit Markdown
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-400">
                  Chars: {project.notes ? project.notes.length : 0}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNotes}
                  className="px-3 py-1.5 rounded-xl border-2 border-slate-700 bg-[#1e293b] text-slate-200 hover:bg-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : '📋 Copy Notes'}</span>
                </button>
              </div>
            </div>

            {/* Render Mode vs Edit Mode */}
            {notesViewMode === 'preview' ? (
              renderFormattedMarkdown(project.notes || '')
            ) : (
              <textarea
                rows={10}
                value={project.notes || ''}
                onChange={(e) => onUpdateNotes(project.id, e.target.value)}
                placeholder="# Large Heading&#10;## Sub Heading&#10;**bold text**&#10;- List item 1&#10;- List item 2"
                className="w-full p-4 rounded-2xl border-2 border-slate-700 bg-[#1e293b] text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
              />
            )}

            <p className="text-[10px] text-slate-400 font-medium">
              💡 Markdown Rules: `# Header 1` for big title, `## Header 2` for subheaders, `**bold**` for bold font, `- list item` for bullet points!
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-3 border-t-2 border-slate-800">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl border-2 border-slate-800 bg-[#1e293b] text-slate-300 font-extrabold text-xs hover:bg-slate-700 cursor-pointer"
          >
            Close Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
