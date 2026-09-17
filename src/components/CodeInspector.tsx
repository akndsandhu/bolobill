import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  FileCode,
  Download,
  Search,
  FileText,
  ShieldCheck,
  Smartphone,
  Layers,
} from 'lucide-react';
import { KOTLIN_DELIVERABLES } from '../data/kotlinCodebase';
import { KotlinFileEntry } from '../types';

export const CodeInspector: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(KOTLIN_DELIVERABLES[0].id);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeFile: KotlinFileEntry =
    KOTLIN_DELIVERABLES.find((f) => f.id === selectedFileId) || KOTLIN_DELIVERABLES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredFiles = KOTLIN_DELIVERABLES.filter(
    (f) =>
      f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Production Android Architecture (Jetpack Compose)
            </h2>
            <p className="text-[11px] text-slate-400">
              Clean Kotlin Codebase • 100% Google Play Policy Compliant (Target SDK 35)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition active:scale-95 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Download .kt
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left Sidebar: File Directory */}
        <div className="lg:col-span-4 border-r border-slate-800 bg-slate-950/40 flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Kotlin files..."
                className="w-full bg-slate-900 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredFiles.map((file) => {
              const isSelected = file.id === activeFile.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex flex-col gap-1 border ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-xs'
                      : 'border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="font-mono text-xs font-semibold truncate">{file.filename}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-blue-300 border border-slate-700">
                      {file.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 pl-5">
                    {file.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col min-h-0 bg-slate-950">
          {/* File Meta Header */}
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-400 truncate">
              <span className="text-blue-400 font-semibold">{activeFile.path}</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {activeFile.code.split('\n').length} lines • Kotlin 2.1 / Jetpack Compose
            </span>
          </div>

          {/* Code Text Area with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-300 selection:bg-blue-600/40">
            <pre className="overflow-x-auto">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
