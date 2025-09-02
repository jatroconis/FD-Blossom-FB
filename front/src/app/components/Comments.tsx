import { useState, type FormEvent } from "react";
import {
  GET_COMMENTS, type GetCommentsData, type GetCommentsVars,
  ADD_COMMENT, type AddCommentData, type AddCommentVars
} from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";

export default function Comments({ characterId }: { characterId: number }) {
  const { data, loading, error } = useQuery<GetCommentsData, GetCommentsVars>(GET_COMMENTS, { variables: { id: characterId } });
  const [content, setContent] = useState("");

const [addComment, { loading: sending }] = useMutation<
  AddCommentData,
  AddCommentVars
>(ADD_COMMENT, {
  onCompleted() { setContent(""); },
  update(cache, { data }) {
    if (!data) return;
    const existing = cache.readQuery<GetCommentsData, GetCommentsVars>({
      query: GET_COMMENTS,
      variables: { id: characterId }
    });
    const next = existing?.comments
      ? [...existing.comments, data.addComment]
      : [data.addComment];
    cache.writeQuery<GetCommentsData, GetCommentsVars>({
      query: GET_COMMENTS,
      variables: { id: characterId },
      data: { comments: next }
    });
  },
});


  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">Comentarios</h3>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (!content.trim()) return;
          addComment({ variables: { id: characterId, content } }).catch(() => {});
        }}
        className="flex items-start gap-2"
      >
        <textarea
          className="flex-1 border rounded p-2 min-h-[80px] bg-white"
          placeholder="Escribe un comentario…"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="h-10 px-4 rounded bg-indigo-600 text-white disabled:opacity-60"
        >
          {sending ? "Enviando…" : "Agregar"}
        </button>
      </form>

      <div className="space-y-2">
        {loading && <p className="text-sm text-zinc-500">Cargando comentarios…</p>}
        {error && <p className="text-sm text-red-600">Error: {error.message}</p>}
        {!loading && (data?.comments?.length ?? 0) === 0 && (
          <p className="text-sm text-zinc-500">Sé el primero en comentar.</p>
        )}
        {data?.comments?.map(c => (
          <div key={c.id} className="rounded border bg-white p-3">
            <p className="text-sm">{c.content}</p>
            <p className="text-xs text-zinc-500 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
