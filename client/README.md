# CS2Boost

## The pattern I usually apply is:

- `group 1`: default utilities
- `group 2`: breakpoint utilities
- `group 3`: dark mode utilities
- `group 4`: other variants utilities

Let's implement this into previous `Button` component:

```javascript
function Button({ children }) {
  return (
    <button
      className={clsx(
        // group 1
        'inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-transparent bg-purple-600 px-4 text-center text-sm font-bold text-white transition duration-150',
        // group 2
        'md:rounded-xl',
        // group 3
        'dark:bg-purple-600 dark:hover:bg-purple-500',
        // group 4
        'hover:bg-purple-700'
      )}
    >
      {children}
    </button>
  );
}
```
