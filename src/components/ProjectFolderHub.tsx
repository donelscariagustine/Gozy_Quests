import React, { useState } from 'react';
import { ProjectFolder, CharacterClass } from '../types/todo';
import { FolderPlus, Calendar, ListTodo, FileText, Trash2, ExternalLink, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProjectFolderHubProps {
  projects: ProjectFolder[];
  onOpenAddProjectModal: () => void;
  onOpenProjectWorkspace: (project: ProjectFolder) => void;
  onDeleteProject: (projectId: string) => void;
  onCompleteProjectFolder?: (projectId: string) => void;
}

export const ProjectFolderHub: React.FC<ProjectFolderHubProps> = ({
  projects,
  onOpenAddProjectModal,
  onOpenProjectWorkspace,
  onDeleteProject,
  onCompleteProjectFolder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = projects.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-pop-in max-w-full overflow-hidden">
      {/* Top Banner Actions & Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📁</span>
            <h2 className="text-xl font-black text-white">Code Projects & Folder Hub</h2>
          </div>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            Organize subquests, push steps to the main questboard, and maintain developer notebooks!
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onOpenAddProjectModal();
          }}
          className="btn-tactile bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 text-xs flex items-center justify-center gap-2 shrink-0 shadow-[2px_2px_0px_0px_#020617] cursor-pointer"
        >
          <FolderPlus className="w-4 h-4 stroke-[3]" /> + New Project Folder
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: `📂 All Folders (${projects.length})` },
          { id: 'coding', label: '💻 Coding' },
          { id: 'workout', label: '🏋️‍♂️ Workout' },
          { id: 'study', label: '📚 Study' },
          { id: 'work', label: '💼 Work' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              sounds.playPop();
              setSelectedCategory(tab.id);
            }}
            className={`px-3.5 py-2 rounded-xl border-2 text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm scale-105'
                : 'border-slate-800 bg-[#1e293b] text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Folder Grid Container */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border-4 border-dashed border-slate-800 bg-[#0f172a] p-8 space-y-3">
          <div className="text-4xl">📁</div>
          <h3 className="text-base font-black text-white">No Project Folders Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Create physical folder cards to organize subquests, track deadlines, and maintain developer notebooks!
          </p>
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onOpenAddProjectModal();
            }}
            className="btn-tactile bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 inline-flex items-center gap-2 cursor-pointer shadow-sm mt-2"
          >
            <FolderPlus className="w-4 h-4" /> Create First Folder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const completedSubtasksCount = project.subtasks.filter((st) => st.completed).length;
            const allSubtasksDone = project.subtasks.length > 0 && completedSubtasksCount === project.subtasks.length;
            const isCompleted = project.completed;

            return (
              <div
                key={project.id}
                className={`group relative rounded-3xl border-4 bg-[#0f172a] p-5 shadow-[4px_4px_0px_0px_#020617] hover:translate-y-[-3px] transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-500/60 bg-emerald-950/20'
                    : 'border-slate-800'
                }`}
              >
                {/* Physical Folder Colored Top Tab Overlay */}
                <div
                  className="absolute -top-3.5 left-6 h-4 w-24 rounded-t-xl border-t-2 border-x-2 border-slate-800 shadow-sm"
                  style={{ backgroundColor: project.colorTag }}
                />

                <div>
                  {/* Folder Header & Deadline Badge */}
                  <div className="flex items-start justify-between gap-2 mt-1 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-xl border border-slate-700 bg-[#1e293b] px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-300">
                          {project.category}
                        </span>
                        {isCompleted && (
                          <span className="rounded-xl border border-emerald-500/50 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                            ✅ Done
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-black text-white leading-snug mt-1 break-words line-clamp-1">
                        {project.name}
                      </h3>
                    </div>

                    <span className="rounded-xl border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-[10px] font-black text-amber-300 shrink-0">
                      📅 {project.targetDeadline}
                    </span>
                  </div>

                  {/* Overview Snippet */}
                  <p className="text-xs text-slate-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {project.overview}
                  </p>
                </div>

                {/* Subtask Counts & Complete Action */}
                <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{completedSubtasksCount}/{project.subtasks.length} Subtasks</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onCompleteProjectFolder && !isCompleted && allSubtasksDone && (
                      <button
                        type="button"
                        onClick={() => {
                          onCompleteProjectFolder(project.id);
                        }}
                        className="btn-tactile bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-[10px] px-2.5 py-1.5 flex items-center gap-1 cursor-pointer shadow-sm animate-bounce-subtle"
                        title="Complete Folder (+100 XP)"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onDeleteProject(project.id);
                      }}
                      className="p-2 rounded-xl border-2 border-slate-800 bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
                      title="Delete Project Folder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onOpenProjectWorkspace(project);
                      }}
                      className="btn-tactile bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-3.5 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-chunky-sm"
                    >
                      <span>Workspace</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
