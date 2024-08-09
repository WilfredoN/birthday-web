import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export const App = () => {
	const ref = useRef<HTMLCanvasElement>(null)

	const { scrollYProgress } = useScroll()

	const images = useMemo(() => {
		const loadedImages: HTMLImageElement[] = []
		for (let i = 1; i <= 250; i++) {
			const img = new Image()
			img.src = `/media/frames/${i}.webp`
			loadedImages.push(img)
		}
		return loadedImages
	}, [])

	const currentIndex = useTransform(scrollYProgress, [0, 1], [1, 250])

	const render = useCallback(
		(index: number) => {
			const canvas = ref.current
			if (canvas && images[index - 1]) {
				const context = canvas.getContext('2d')
				if (context) {
					context.clearRect(0, 0, canvas.width, canvas.height)
					context.drawImage(
						images[index - 1],
						0,
						0,
						canvas.width,
						canvas.height
					)
				}
			}
		},
		[images]
	)

	useMotionValueEvent(currentIndex, 'change', latest => {
		const index = Number(latest?.toFixed() ?? 1)
		render(index)
	})

	useEffect(() => {
		render(1)
	}, [render])

	return (
		<div
			style={{
				height: '6000px',
				backgroundColor: '#d4bbc8'
			}}
		>
			<canvas
				ref={ref}
				width={window.innerWidth}
				height={window.innerHeight}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh'
				}}
			/>
		</div>
	)
}
