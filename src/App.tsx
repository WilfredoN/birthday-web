import { useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export const App = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const ref = useRef<HTMLCanvasElement>(null)

	const { scrollYProgress } = useScroll()

	const images = useMemo(() => {
		const loadedImages: HTMLImageElement[] = []
		for (let i = 1; i <= 250; i++) {
			const img = new Image()
			img.src = `/media/frames/${i}.jpg`
			loadedImages.push(img)
		}
		return loadedImages
	}, [])
	const gifs = useMemo(() => {
		const gifPaths = [
			'/media/cats/1.gif',
			'/media/cats/2.gif',
			'/media/cats/3.gif',
			'/media/cats/4.gif',
			'/media/cats/5.gif',
			'/media/cats/6.gif',
			'/media/cats/7.gif',
			'/media/cats/8.gif',
			'/media/cats/9.gif',
			'/media/cats/10.gif',
			'/media/cats/11.gif'
		]
		const loadedGifs = gifPaths.map(path => {
			const img = new Image()
			img.src = path
			return img
		})
		return loadedGifs
	}, [])

	interface Gif {
		src: string
		rotation: number
		top: string
		left: string
	}

	const isTooClose = useCallback(
		(gif1: Gif, gif2: Gif, minDistance: number): boolean => {
			const dx = parseFloat(gif1.left) - parseFloat(gif2.left)
			const dy = parseFloat(gif1.top) - parseFloat(gif2.top)
			const distance = Math.sqrt(dx * dx + dy * dy)
			return distance < minDistance
		},
		[]
	)

	const randomizeGifs = useCallback(() => {
		const minDistance = 10

		const randomizedGifs = gifs.map(gif => ({
			src: gif.src,
			rotation: Math.random() * 360,
			top: Math.random() * 100 + '%',
			left: Math.random() * 100 + '%'
		}))

		for (let i = 0; i < randomizedGifs.length; i++) {
			for (let j = 0; j < i; j++) {
				while (isTooClose(randomizedGifs[i], randomizedGifs[j], minDistance)) {
					randomizedGifs[i].top = Math.random() * 100 + '%'
					randomizedGifs[i].left = Math.random() * 100 + '%'
				}
			}
		}

		return randomizedGifs
	}, [gifs, isTooClose])

	const randomizedGifs = useMemo(() => randomizeGifs(), [randomizeGifs])

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
		<div>
			<div className="h-[5000px]">
				<canvas
					ref={ref}
					width={window.innerWidth}
					height={window.innerHeight}
					style={{
						position: 'sticky',
						top: 0,
						left: 0,
						width: '100dvw'
					}}
				/>
			</div>
			<div className="relative w-full h-[60rem] overflow-hidden">
				{randomizedGifs.map((gif, index) => (
					<img
						key={index}
						src={gif.src}
						alt={`gif-${index}`}
						className="flying-gif"
						style={{
							position: 'absolute',
							top: gif.top,
							left: gif.left,
							transform: `rotate(${gif.rotation}deg)`,
							overflow: 'hidden'
						}}
					/>
				))}
				<h1 className="absolute animate-pulse overflow-hidden top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-8xl font-bold text-gradient">
					HAPPY BIRTHDAY!
				</h1>
			</div>
		</div>
	)
}
