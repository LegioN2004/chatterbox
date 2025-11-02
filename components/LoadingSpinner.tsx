import styles from './Loader.module.css';

export default function Loader() {
    return (
        // full screen fixed wrapper so the spinner centers in the viewport
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
                <span className={styles.loader} />
                <h3 style={{ marginTop: 12, fontSize: 18, fontWeight: 500, color: '#374151' }}>Loading...</h3>
            </div>
        </div>
    )
}
