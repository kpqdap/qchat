import * as React from "react"

interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

enum ActionType {
  ADD_TOAST = "ADD_TOAST",
  UPDATE_TOAST = "UPDATE_TOAST",
  DISMISS_TOAST = "DISMISS_TOAST",
  REMOVE_TOAST = "REMOVE_TOAST",
}

type Action =
  | { type: ActionType.ADD_TOAST; toast: ToastProps }
  | { type: ActionType.UPDATE_TOAST; toast: Partial<ToastProps> & { id: string } }
  | { type: ActionType.DISMISS_TOAST; toastId?: string }
  | { type: ActionType.REMOVE_TOAST; toastId?: string }

interface State {
  toasts: ToastProps[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (dispatch: React.Dispatch<Action>, toastId: string): void => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: ActionType.REMOVE_TOAST,
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }
    case ActionType.DISMISS_TOAST: {
      const { toastId } = action
      if (toastId) {
        addToRemoveQueue(dispatch, toastId) // This line was adjusted
      } else {
        state.toasts.forEach(toast => addToRemoveQueue(dispatch, toast.id)) // And this one
      }
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === toastId || !toastId ? { ...t, open: false } : t)),
      }
    }
    case ActionType.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      }
    default:
      return state
  }
}

let memoryState: State = { toasts: [] }

function useToast(): ReturnType<typeof reducer> {
  const [state, setState] = React.useState<State>(memoryState)

  const dispatch = React.useCallback((action: Action) => {
    const newState = reducer(memoryState, action)
    memoryState = newState
    setState(newState)
  }, [])

  const toast = React.useCallback(
    (props: Omit<ToastProps, "id">) => {
      const id = Date.now().toString()
      const dismiss = (): void => dispatch({ type: ActionType.DISMISS_TOAST, toastId: id })
      const update = (props: Partial<ToastProps>): void =>
        dispatch({
          type: ActionType.UPDATE_TOAST,
          toast: { id, ...props },
        })

      dispatch({
        type: ActionType.ADD_TOAST,
        toast: { ...props, id, open: true },
      })

      return { id, dismiss, update }
    },
    [dispatch]
  )

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: ActionType.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }
