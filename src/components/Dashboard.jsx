import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabase'

const BOX_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(dateStr).toLocaleDateString()
}

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return '' }
}

const SOURCE_ICONS = {
  'claude.ai': (
    <svg width="16" height="16" viewBox="0 0 24 24" className="source-icon">
      <path fill="#D97757" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
    </svg>
  ),
  'chatgpt.com': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="source-icon">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.05 6.05 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.05 6.05 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="#10a37f"/>
    </svg>
  ),
  'gemini.google.com': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="source-icon">
      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemini-grad)"/>
      <defs><linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#1C7EF2"/><stop offset="1" stopColor="#A855F7"/></linearGradient></defs>
    </svg>
  ),
}

function getSourceIcon(url) {
  const domain = getDomain(url)
  return SOURCE_ICONS[domain] || null
}

// Chevron SVG
const Chevron = ({ expanded }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    className={`memento-chevron${expanded ? ' expanded' : ''}`}>
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)


export default function Dashboard({ session }) {
  const [captures, setCaptures] = useState([])
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('all') // 'all' or a box id
  const [expandedId, setExpandedId] = useState(null)
  const [editingTaglineId, setEditingTaglineId] = useState(null)
  const [editingTaglineVal, setEditingTaglineVal] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [showCreateBox, setShowCreateBox] = useState(false)
  const [newBoxName, setNewBoxName] = useState('')
  const [newBoxColor, setNewBoxColor] = useState(BOX_COLORS[0])
  const [pendingDeleteBoxId, setPendingDeleteBoxId] = useState(null)
  const [boxPickerId, setBoxPickerId] = useState(null)
  const boxPickerRef = useRef(null)

  // Close box picker on outside click
  useEffect(() => {
    if (!boxPickerId) return
    function handleClick(e) {
      if (boxPickerRef.current && !boxPickerRef.current.contains(e.target)) {
        setBoxPickerId(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [boxPickerId])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: captureData } = await supabase
        .from('captures')
        .select('id, text, url, blocks, source_text, tagline, box_id, created_at')
        .order('created_at', { ascending: false })

      setCaptures(captureData ?? [])

      const { data: boxData } = await supabase
        .from('memento_boxes')
        .select('*')
        .order('created_at', { ascending: true })

      setBoxes(boxData ?? [])
      setLoading(false)
    }

    fetchData()
  }, [session])

  // Filtered captures
  const visibleCaptures = activeView === 'all'
    ? captures
    : activeView === 'unsorted'
    ? captures.filter(c => !c.box_id)
    : captures.filter(c => c.box_id === activeView)

  const activeBox = boxes.find(b => b.id === activeView)

  // Count captures per box
  const boxCounts = {}
  for (const c of captures) {
    if (c.box_id) boxCounts[c.box_id] = (boxCounts[c.box_id] || 0) + 1
  }
  const unsortedCount = captures.filter(c => !c.box_id).length

  // ── Handlers ───────────────────────────────────────────────────────────
  async function deleteCapture() {
    const id = pendingDeleteId
    setPendingDeleteId(null)
    const { error } = await supabase.from('captures').delete().eq('id', id)
    if (!error) {
      setCaptures(prev => prev.filter(c => c.id !== id))
      if (expandedId === id) setExpandedId(null)
    }
  }

  async function saveTagline(id, tagline) {
    setEditingTaglineId(null)
    setCaptures(prev => prev.map(c => c.id === id ? { ...c, tagline } : c))
    await supabase.from('captures').update({ tagline }).eq('id', id)
  }

  async function assignBox(captureId, boxId) {
    setCaptures(prev => prev.map(c => c.id === captureId ? { ...c, box_id: boxId } : c))
    await supabase.from('captures').update({ box_id: boxId }).eq('id', captureId)
  }

  async function createBox() {
    if (!newBoxName.trim()) return
    const { data, error } = await supabase
      .from('memento_boxes')
      .insert({ user_id: session.user.id, name: newBoxName.trim(), color: newBoxColor })
      .select()
      .single()

    if (!error && data) {
      setBoxes(prev => [...prev, data])
    }
    setNewBoxName('')
    setNewBoxColor(BOX_COLORS[0])
    setShowCreateBox(false)
  }

  async function deleteBox() {
    const boxId = pendingDeleteBoxId
    setPendingDeleteBoxId(null)
    // Un-associate all captures in this box
    setCaptures(prev => prev.map(c => c.box_id === boxId ? { ...c, box_id: null } : c))
    await supabase.from('captures').update({ box_id: null }).eq('box_id', boxId)
    // Delete the box
    const { error } = await supabase.from('memento_boxes').delete().eq('id', boxId)
    if (!error) {
      setBoxes(prev => prev.filter(b => b.id !== boxId))
      if (activeView === boxId) setActiveView('all')
    }
  }

  async function generateTagline(captureId) {
    setCaptures(prev => prev.map(c => c.id === captureId ? { ...c, _generating: true } : c))
    try {
      const { data, error } = await supabase.functions.invoke('generate-tagline', {
        body: { capture_id: captureId },
      })
      if (!error && data?.tagline) {
        setCaptures(prev => prev.map(c => c.id === captureId ? { ...c, tagline: data.tagline, _generating: false } : c))
      } else {
        setCaptures(prev => prev.map(c => c.id === captureId ? { ...c, _generating: false, _genError: true } : c))
        setEditingTagline(captureId)
        setEditingTaglineVal('')
      }
    } catch {
      setCaptures(prev => prev.map(c => c.id === captureId ? { ...c, _generating: false, _genError: true } : c))
      setEditingTagline(captureId)
      setEditingTaglineVal('')
    }
  }

  // ── Get tagline for display ────────────────────────────────────────────
  function getTagline(c) {
    if (c.tagline) return c.tagline
    const text = c.text || (c.blocks && c.blocks[0]?.text) || ''
    return text.slice(0, 80) || 'Untitled memento'
  }

  function getBoxForCapture(c) {
    return c.box_id ? boxes.find(b => b.id === c.box_id) : null
  }

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) {
    return <div className="dashboard"><div className="loading-spinner">Loading...</div></div>
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="box-view-header">
        {activeBox ? (
          <>
            <span className="memento-box-dot" style={{ background: activeBox.color, width: 12, height: 12 }} />
            <span className="box-view-name">{activeBox.name}</span>
            <span className="box-view-count">{visibleCaptures.length} memento{visibleCaptures.length !== 1 ? 's' : ''}</span>
            <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }}
              onClick={() => setPendingDeleteBoxId(activeBox.id)}>
              Delete box
            </button>
          </>
        ) : activeView === 'unsorted' ? (
          <>
            <span className="memento-box-dot memento-box-dot-empty" style={{ width: 12, height: 12 }} />
            <span className="box-view-name">Unsorted Mementos</span>
            <span className="box-view-count">{visibleCaptures.length} memento{visibleCaptures.length !== 1 ? 's' : ''}</span>
          </>
        ) : (
          <>
            <span className="memento-box-dot" style={{ background: '#0f7588', width: 12, height: 12 }} />
            <span className="box-view-name">My Mementos</span>
            <span className="box-view-count">{captures.length} memento{captures.length !== 1 ? 's' : ''}</span>
          </>
        )}
      </div>

      {/* Boxes bar */}
      <div className="boxes-bar">
        <button
          className={`box-chip${activeView === 'all' ? ' active' : ''}`}
          onClick={() => setActiveView('all')}
        >
          <span className="box-chip-dot" style={{ background: '#0f7588' }} />
          All
          <span className="box-chip-count">{captures.length}</span>
        </button>

        {unsortedCount > 0 && (
          <button
            className={`box-chip${activeView === 'unsorted' ? ' active' : ''}`}
            onClick={() => setActiveView('unsorted')}
          >
            <span className="box-chip-dot box-chip-dot-empty" />
            Unsorted
            <span className="box-chip-count">{unsortedCount}</span>
          </button>
        )}

        {boxes.map(box => (
          <button
            key={box.id}
            className={`box-chip${activeView === box.id ? ' active' : ''}`}
            style={{
              '--box-color': box.color,
              '--box-bg': box.color + '15',
            }}
            onClick={() => setActiveView(box.id)}
          >
            <span className="box-chip-dot" style={{ background: box.color }} />
            {box.name}
            <span className="box-chip-count">{boxCounts[box.id] || 0}</span>
          </button>
        ))}

        <button className="box-chip box-chip-add" onClick={() => setShowCreateBox(true)}>
          +
        </button>
      </div>

      {/* Memento list */}
      <div className="memento-list">
        {visibleCaptures.length === 0 ? (
          <div className="memento-empty">
            {captures.length === 0
              ? 'No mementos yet. Use the extension to capture your first.'
              : 'No mementos in this view.'}
          </div>
        ) : (
          visibleCaptures.map(c => {
            const isExpanded = expandedId === c.id
            const isEditing = editingTaglineId === c.id
            const box = getBoxForCapture(c)
            const blocks = c.blocks || [{ text: c.text, role: 'unknown' }]
            const jumpHref = c.url
              ? c.url + '#cb-find=' + encodeURIComponent(c.source_text || c.text?.slice(0, 80) || '')
              : null

            return (
              <div key={c.id} className="memento-card">
                {/* Compact header row */}
                <div className="memento-card-header" onClick={() => {
                  if (!isEditing) setExpandedId(isExpanded ? null : c.id)
                }}>
                  <div className="box-picker-wrapper" ref={boxPickerId === c.id ? boxPickerRef : null} onClick={e => e.stopPropagation()}>
                    <button
                      className="box-picker-trigger"
                      onClick={() => setBoxPickerId(boxPickerId === c.id ? null : c.id)}
                      title="Assign to box"
                    >
                      {box ? (
                        <span className="memento-box-dot" style={{ background: box.color }} />
                      ) : (
                        <span className="memento-box-dot memento-box-dot-empty" />
                      )}
                    </button>
                    {boxPickerId === c.id && (
                      <div className="box-picker-popover">
                        {boxes.map(b => (
                          <button
                            key={b.id}
                            className={`box-picker-option${c.box_id === b.id ? ' active' : ''}`}
                            onClick={() => {
                              assignBox(c.id, c.box_id === b.id ? null : b.id)
                              setBoxPickerId(null)
                            }}
                          >
                            <span className="box-picker-dot" style={{ background: b.color }} />
                            <span className="box-picker-name">{b.name}</span>
                          </button>
                        ))}
                        {c.box_id && (
                          <button
                            className="box-picker-option box-picker-remove"
                            onClick={() => { assignBox(c.id, null); setBoxPickerId(null) }}
                          >
                            Remove from box
                          </button>
                        )}
                        {boxes.length === 0 && (
                          <div className="box-picker-empty">No boxes yet</div>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="memento-tagline-edit" onClick={e => e.stopPropagation()}>
                      <input
                        className="memento-tagline-input"
                        value={editingTaglineVal}
                        onChange={e => setEditingTaglineVal(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveTagline(c.id, editingTaglineVal)
                          if (e.key === 'Escape') setEditingTaglineId(null)
                        }}
                        onBlur={() => saveTagline(c.id, editingTaglineVal)}
                        placeholder="Enter a tagline..."
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      <span
                        className={`memento-tagline${!c.tagline ? ' memento-tagline-empty' : ''}`}
                      >
                        {getTagline(c)}
                      </span>
                      <button
                        className="memento-edit-btn"
                        title="Edit tagline"
                        onClick={e => {
                          e.stopPropagation()
                          setEditingTaglineId(c.id)
                          setEditingTaglineVal(c.tagline || '')
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M8.5 1.5l2 2M1 11l.5-2L9 1.5l2 2L3.5 11l-2 .5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )}

                  <div className="memento-meta">
                    {c.url && (
                      <span className="memento-source">
                        {getSourceIcon(c.url) || getDomain(c.url)}
                      </span>
                    )}
                    <span className="memento-time">{timeAgo(c.created_at)}</span>
                  </div>

                  <Chevron expanded={isExpanded} />
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <>
                    <div className="memento-body">
                      {(() => {
                        const filtered = blocks.filter(b => b.text?.trim())
                        const roles = new Set(filtered.map(b => b.role).filter(r => r && r !== 'unknown'))
                        const isSingleRole = roles.size <= 1
                        return filtered.map((block, i) => {
                          const prevRole = i > 0 ? filtered[i - 1].role : null
                          const showLabel = !isSingleRole && block.role && block.role !== 'unknown' && block.role !== prevRole
                          return (
                        <div key={i} className={`memento-block memento-block-${block.role || 'unknown'}`}>
                          {showLabel && (
                            <div className="memento-block-role">{block.role === 'user' ? 'PROMPT' : block.role === 'assistant' ? 'RESPONSE' : block.role}</div>
                          )}
                          <div className="memento-block-text">{block.text}</div>
                        </div>
                          )
                        })
                      })()}
                    </div>

                    <div className="memento-footer">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {new Date(c.created_at).toLocaleString()}
                      </span>
                      <div className="memento-footer-actions">
                        {!c.tagline && (
                          c._genError ? (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                              Generation failed — type a tagline above
                            </span>
                          ) : (
                            <button className="btn btn-sm btn-ghost"
                              disabled={c._generating}
                              onClick={e => { e.stopPropagation(); generateTagline(c.id) }}>
                              {c._generating ? 'Generating...' : '✨ Auto-generate tagline'}
                            </button>
                          )
                        )}
                        {jumpHref && (
                          <a href={jumpHref} target="_blank" rel="noreferrer"
                            className="btn btn-sm btn-ghost"
                            onClick={e => e.stopPropagation()}>
                            Jump to source
                          </a>
                        )}
                        <button className="btn btn-sm btn-danger"
                          onClick={e => { e.stopPropagation(); setPendingDeleteId(c.id) }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Delete confirmation modal */}
      {pendingDeleteId && (
        <div className="modal-overlay" onClick={() => setPendingDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete this memento?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              This can't be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-sm" onClick={() => setPendingDeleteId(null)}>Cancel</button>
              <button className="btn btn-sm btn-danger" onClick={deleteCapture}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete box confirmation modal */}
      {pendingDeleteBoxId && (
        <div className="modal-overlay" onClick={() => setPendingDeleteBoxId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete this box?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              All mementos in this box will be moved to Unsorted. This can't be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-sm" onClick={() => setPendingDeleteBoxId(null)}>Cancel</button>
              <button className="btn btn-sm btn-danger" onClick={deleteBox}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create box modal */}
      {showCreateBox && (
        <div className="modal-overlay" onClick={() => setShowCreateBox(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create a memento box</h3>

            <div className="modal-field">
              <label>Name</label>
              <input
                value={newBoxName}
                onChange={e => setNewBoxName(e.target.value)}
                placeholder="e.g. Project Ideas"
                onKeyDown={e => { if (e.key === 'Enter') createBox() }}
                autoFocus
              />
            </div>

            <div className="modal-field">
              <label>Color</label>
              <div className="color-picker">
                {BOX_COLORS.map(color => (
                  <button
                    key={color}
                    className={`color-swatch${newBoxColor === color ? ' selected' : ''}`}
                    style={{ background: color }}
                    onClick={() => setNewBoxColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-sm" onClick={() => setShowCreateBox(false)}>Cancel</button>
              <button className="btn btn-sm btn-primary" onClick={createBox}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
