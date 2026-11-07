import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  Info,
  ShieldCheck,
  RotateCcw,
  Code2,
  AlertCircle,
  FileCode,
  SlidersHorizontal,
  Search,
  CheckCircle2
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { QUERY_PRESETS, QueryPresetDef } from '@/server/config/queryPresets';

export const AdminMongoLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(QUERY_PRESETS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [queryCode, setQueryCode] = useState<string>(QUERY_PRESETS[0].mongoSyntax);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'json' | 'explain' | 'sql'>('json');
  const [resultFilterTerm, setResultFilterTerm] = useState('');

  const [queryExecutionOutput, setQueryExecutionOutput] = useState<{
    query?: string;
    executionTimeMs: number;
    docsExamined: number;
    docsReturned: number;
    winningPlan: string;
    result: any;
    explainPlan: any;
  } | null>(null);

  const activePreset = QUERY_PRESETS.find(p => p.id === selectedPresetId) || QUERY_PRESETS[0];
  const isQueryModified = queryCode.trim() !== activePreset.mongoSyntax.trim();

  // Run initial query on mount
  useEffect(() => {
    handleRunQuery(selectedPresetId, activePreset.mongoSyntax);
  }, []);

  const handleSelectPreset = (preset: QueryPresetDef) => {
    setSelectedPresetId(preset.id);
    setQueryCode(preset.mongoSyntax);
    setExecutionError(null);
    handleRunQuery(preset.id, preset.mongoSyntax);
  };

  const handleResetQuery = () => {
    setQueryCode(activePreset.mongoSyntax);
    setExecutionError(null);
  };

  const handleRunQuery = async (presetId?: string, codeToRun?: string) => {
    setIsExecuting(true);
    setExecutionError(null);
    const code = codeToRun !== undefined ? codeToRun : queryCode;

    try {
      // If code was modified from preset, execute as customQuery
      const isModified = code.trim() !== activePreset.mongoSyntax.trim();
      const res = await dataService.executeMongoQuery(
        isModified ? undefined : presetId,
        isModified ? code : undefined
      );
      setQueryExecutionOutput(res);
    } catch (err: any) {
      console.error('MongoDB query execution failed:', err);
      setExecutionError(err?.message || 'Failed to execute MongoDB query. Check syntax.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery(selectedPresetId, queryCode);
    }
  };

  const handleInjectModifier = (modifierSnippet: string) => {
    // Append or replace helper
    setQueryCode(prev => {
      if (modifierSnippet.startsWith('.')) {
        // e.g. .sort({ price: 1 })
        return prev.trim().replace(/;$/, '') + modifierSnippet;
      } else {
        return modifierSnippet;
      }
    });
  };

  const handleCopy = () => {
    if (queryExecutionOutput?.result) {
      navigator.clipboard.writeText(JSON.stringify(queryExecutionOutput.result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories = [
    'All', 
    'CRUD Operations', 
    'Atomic Modifiers ($set, $inc, $push, $pull)', 
    'Aggregation Pipelines ($group, $unwind, $sum, $avg)', 
    'Indexing & Text Search'
  ];

  const filteredPresets = activeCategory === 'All' 
    ? QUERY_PRESETS 
    : QUERY_PRESETS.filter(p => p.category === activeCategory);

  // Filter json results if search term provided
  let displayResult = queryExecutionOutput?.result;
  if (resultFilterTerm.trim() && displayResult) {
    if (Array.isArray(displayResult)) {
      displayResult = displayResult.filter(item => 
        JSON.stringify(item).toLowerCase().includes(resultFilterTerm.toLowerCase())
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              MongoDB Query Lab
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Live Database Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-blue-600" /> Interactive Query Editor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Execute, edit, and experiment with real MongoDB MQL queries directly against the <code className="font-bold text-slate-800">shopease</code> Atlas database collections.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isQueryModified && (
            <button
              type="button"
              onClick={handleResetQuery}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Revert modifications to original preset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleRunQuery(selectedPresetId, queryCode)}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isExecuting ? 'Executing Query...' : 'Run Query (Ctrl+Enter)'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Preset Cards Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredPresets.map(preset => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleSelectPreset(preset)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedPresetId === preset.id
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider font-mono">
                db.{preset.collection}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {preset.operation}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{preset.title}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {preset.description}
            </p>
          </button>
        ))}
      </div>

      {/* Query Detail & Live Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Query Editor & Quick Modifiers (6 cols) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex-1 flex flex-col">
            {/* Editor Top Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-300 ml-2 font-semibold">
                  mongosh &bull; {activePreset.collection}
                </span>
                {isQueryModified ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Modified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                    Preset
                  </span>
                )}
              </div>
              <span className="text-emerald-400 text-[11px] font-bold">
                Target: db.{activePreset.collection}
              </span>
            </div>

            {/* Quick Injections Toolbar */}
            <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3 h-3" /> Quick Modifiers:
              </span>
              <button
                type="button"
                onClick={() => handleInjectModifier('.sort({ price: 1 })')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] whitespace-nowrap"
                title="Append sort by price ascending"
              >
                + Price ASC
              </button>
              <button
                type="button"
                onClick={() => handleInjectModifier('.sort({ rating: -1 })')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] whitespace-nowrap"
                title="Append sort by rating descending"
              >
                + Top Rated
              </button>
              <button
                type="button"
                onClick={() => handleInjectModifier('.limit(5)')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] whitespace-nowrap"
                title="Limit output to 5 items"
              >
                + Limit 5
              </button>
              <button
                type="button"
                onClick={() => handleInjectModifier('db.products.find({ price: { $lt: 200 } })')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] whitespace-nowrap"
                title="Find products with price under $200"
              >
                Price &lt; $200
              </button>
              <button
                type="button"
                onClick={() => handleInjectModifier('db.products.countDocuments({ stock: { $lt: 15 } })')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] whitespace-nowrap"
                title="Count low-stock items"
              >
                Low Stock Count
              </button>
            </div>

            {/* Editable Query Textarea Editor */}
            <div className="p-4 flex-1 bg-slate-900 flex flex-col">
              <label htmlFor="mongo-query-editor" className="sr-only">
                MongoDB Query Editor
              </label>
              <textarea
                id="mongo-query-editor"
                value={queryCode}
                onChange={e => setQueryCode(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={10}
                spellCheck={false}
                placeholder="Type or modify your MongoDB query here: e.g. db.products.find({ category: 'Electronics' })"
                className="w-full flex-1 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-y min-h-[200px]"
              />
            </div>

            {/* Execution Error Banner (if any) */}
            {executionError && (
              <div className="px-4 py-3 bg-rose-950/80 border-t border-rose-900/60 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Query Error:</strong>
                  <span>{executionError}</span>
                </div>
              </div>
            )}

            {/* Run Button Action Strip */}
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">Enter</kbd> to execute
              </span>
              <div className="flex items-center gap-2">
                {isQueryModified && (
                  <button
                    type="button"
                    onClick={handleResetQuery}
                    className="px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRunQuery(selectedPresetId, queryCode)}
                  disabled={isExecuting}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Explanation Callout */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Query Mechanics & Optimization:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {activePreset.explanation}
            </p>
          </div>
        </div>

        {/* Right Column: Execution Output, Telemetry & Plan (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 flex flex-col min-h-[520px]">
            {/* Header Tabs */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveResultTab('json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeResultTab === 'json'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Actual Database Result
                </button>
                <button
                  type="button"
                  onClick={() => setActiveResultTab('explain')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeResultTab === 'explain'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Execution Plan (explain())
                </button>
                <button
                  type="button"
                  onClick={() => setActiveResultTab('sql')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeResultTab === 'sql'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Equivalent SQL
                </button>
              </div>

              {activeResultTab === 'json' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Performance Telemetry Strip */}
            {queryExecutionOutput && (
              <div className="grid grid-cols-4 gap-2 py-3 px-3.5 rounded-xl bg-slate-50 border border-slate-100 my-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Execution Time</span>
                  <span className="font-bold text-emerald-600 tabular-nums">
                    {queryExecutionOutput.executionTimeMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Examined</span>
                  <span className="font-bold text-slate-800 tabular-nums">
                    {queryExecutionOutput.docsExamined}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Returned</span>
                  <span className="font-bold text-blue-600 tabular-nums">
                    {queryExecutionOutput.docsReturned}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Winning Plan</span>
                  <span className="font-bold text-violet-600 text-[11px] truncate block" title={queryExecutionOutput.winningPlan}>
                    {queryExecutionOutput.winningPlan || 'IXSCAN'}
                  </span>
                </div>
              </div>
            )}

            {/* Search filter for large results */}
            {activeResultTab === 'json' && Array.isArray(queryExecutionOutput?.result) && queryExecutionOutput.result.length > 5 && (
              <div className="mb-3 relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter returned documents in view..."
                  value={resultFilterTerm}
                  onChange={e => setResultFilterTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Tab 1: JSON Output */}
            {activeResultTab === 'json' && (
              <div className="flex-1 bg-slate-950 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-emerald-400 max-h-[420px] select-text">
                <pre className="whitespace-pre">
                  {displayResult
                    ? JSON.stringify(displayResult, null, 2)
                    : isExecuting ? '// Executing query against database...' : '// No result'}
                </pre>
              </div>
            )}

            {/* Tab 2: Explain Plan */}
            {activeResultTab === 'explain' && queryExecutionOutput && (
              <div className="flex-1 bg-slate-900 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-cyan-300 max-h-[420px]">
                <pre className="whitespace-pre">
                  {JSON.stringify(queryExecutionOutput.explainPlan, null, 2)}
                </pre>
              </div>
            )}

            {/* Tab 3: SQL Translation */}
            {activeResultTab === 'sql' && (
              <div className="flex-1 space-y-4">
                <div className="bg-slate-900 rounded-2xl p-4 text-xs font-mono text-amber-300">
                  <pre className="whitespace-pre">{activePreset.sqlEquivalent}</pre>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <strong>Notice:</strong> In SQL, relational tables require rigid DDL column definitions, join foreign keys, and explicit group by column lists. In MongoDB, data is natively structured in documents with rich arrays and executed via expressive aggregation pipeline stages.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
