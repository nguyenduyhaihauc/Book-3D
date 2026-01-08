import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import {
  pageAtom,
  pages,
  autoFlipEnabledAtom,
  shouldRotateBookAtom,
} from "./UI";

const easingFactor = 0.5; // Controls the speed of the easing
const easingFactorFold = 0.3; // Controls the speed of the easing
const insideCurveStrength = 0.18; // Controls the strength of the curve
const outsideCurveStrength = 0.05; // Controls the strength of the curve
const turningCurveStrength = 0.09; // Controls the strength of the curve

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  // ALL VERTICES
  vertex.fromBufferAttribute(position, i); // get the vertex
  const x = vertex.x; // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // calculate the skin index
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // calculate the skin weight

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0); // set the skin indexes
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
];

pages.forEach((page) => {
  useTexture.preload(`/textures/${page.front}.jpg`);
  useTexture.preload(`/textures/${page.back}.jpg`);
  useTexture.preload(`/textures/book-cover-roughness.jpg`);
});

// Load và hiển thị ảnh trong sách
const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [picture, picture2, pictureRoughness] = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`,
    ...(number === 0 || number === pages.length - 1
      ? [`/textures/book-cover-roughness.jpg`]
      : []),
  ]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);

  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone); // attach the new bone to the previous bone
      }
    }
    const skeleton = new Skeleton(bones);

    // Áp dụng ảnh lên material để hiển thị
    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture,
        ...(number === 0
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: picture2,
        ...(number === pages.length - 1
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
        emissive: emissiveColor,
        emissiveIntensity: 0,
      }),
    ];
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []);

  // useHelper(skinnedMeshRef, SkeletonHelper, "red");

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }

    const emissiveIntensity = highlighted ? 0.22 : 0;
    skinnedMeshRef.current.material[4].emissiveIntensity =
      skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
        skinnedMeshRef.current.material[4].emissiveIntensity,
        emissiveIntensity,
        0.1
      );

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }
      easing.dampAngle(
        target.rotation,
        "y",
        rotationAngle,
        easingFactor,
        delta
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  const [_, setPage] = useAtom(pageAtom);
  const [autoFlipEnabled] = useAtom(autoFlipEnabledAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted && autoFlipEnabled);

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        if (!autoFlipEnabled) return;
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        if (!autoFlipEnabled) return;
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        if (!autoFlipEnabled) return;
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

export const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);
  const [shouldRotateBook, setShouldRotateBook] = useAtom(shouldRotateBookAtom);
  const [, setAutoFlipEnabled] = useAtom(autoFlipEnabledAtom);
  const bookGroupRef = useRef();
  const [targetRotation, setTargetRotation] = useState(-Math.PI / 2); // Bắt đầu từ mặt sau
  const rotationStarted = useRef(false);
  const rotationStartTime = useRef(0);
  const rotationStartAngle = useRef(-Math.PI / 2);
  const rotationStartX = useRef(0);
  const rotationStartZ = useRef(0);
  const scaleStart = useRef(1.5);
  const positionStartY = useRef(0);
  const rotationDuration = 2500; // 2.5 giây để xoay mượt mà và nghệ thuật hơn

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          return delayedPage;
        } else {
          timeout = setTimeout(
            () => {
              goToPage();
            },
            Math.abs(page - delayedPage) > 2 ? 50 : 150
          );
          if (page > delayedPage) {
            return delayedPage + 1;
          }
          if (page < delayedPage) {
            return delayedPage - 1;
          }
        }
      });
    };
    goToPage();
    return () => {
      clearTimeout(timeout);
    };
  }, [page]);

  // Xử lý xoay sách khi đến trang cuối
  useEffect(() => {
    if (shouldRotateBook && !rotationStarted.current && page === pages.length) {
      rotationStarted.current = true;
      rotationStartTime.current = Date.now();
      rotationStartAngle.current =
        bookGroupRef.current?.rotation.y || -Math.PI / 2;
      rotationStartX.current = bookGroupRef.current?.rotation.x || 0;
      rotationStartZ.current = bookGroupRef.current?.rotation.z || 0;
      scaleStart.current = bookGroupRef.current?.scale.x || 1.5;
      positionStartY.current = bookGroupRef.current?.position.y || 0;
      // Xoay 180 độ từ mặt sau về mặt trước
      // Từ -Math.PI / 2 về Math.PI / 2 (xoay 180 độ)
      setTargetRotation(Math.PI / 2);
    }
  }, [shouldRotateBook, page]);

  // Animation xoay sách nghệ thuật - xoay đa trục với easing curve đẹp mắt
  useFrame(() => {
    if (bookGroupRef.current && rotationStarted.current) {
      const elapsed = Date.now() - rotationStartTime.current;
      const progress = Math.min(elapsed / rotationDuration, 1);

      // Sử dụng easeOutBack để có hiệu ứng "bounce" nhẹ và nghệ thuật
      // Công thức: 1 + c * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const easeOutBack =
        1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);

      // Tính góc xoay Y (xoay chính)
      const startAngle = rotationStartAngle.current;
      const endAngle = targetRotation;
      let angleDiff = endAngle - startAngle;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      const currentAngleY = startAngle + angleDiff * easeOutBack;

      // Xoay nhẹ theo trục X để tạo chiều sâu (nghiêng nhẹ khi xoay)
      // Tạo hiệu ứng như sách đang "lật" một cách tự nhiên
      const tiltAmount = Math.sin(progress * Math.PI) * 0.15; // Nghiêng tối đa 0.15 radian
      const currentAngleX = rotationStartX.current + tiltAmount;

      // Xoay nhẹ theo trục Z để tạo động lực (xoay nghiêng nhẹ)
      const rollAmount = Math.sin(progress * Math.PI * 2) * 0.08; // Xoay nghiêng nhẹ
      const currentAngleZ = rotationStartZ.current + rollAmount;

      // Áp dụng các rotation
      bookGroupRef.current.rotation.y = currentAngleY;
      bookGroupRef.current.rotation.x = currentAngleX;
      bookGroupRef.current.rotation.z = currentAngleZ;

      // Thêm scale animation nhẹ (phóng to một chút khi xoay giữa chừng)
      const scalePulse = 1 + Math.sin(progress * Math.PI) * 0.05; // Phóng to 5% ở giữa
      const currentScale = scaleStart.current * scalePulse;
      bookGroupRef.current.scale.set(currentScale, currentScale, currentScale);

      // Thêm position animation nhẹ (nâng lên một chút khi xoay)
      const liftAmount = Math.sin(progress * Math.PI) * 0.1; // Nâng lên 0.1 đơn vị
      bookGroupRef.current.position.y = positionStartY.current + liftAmount;

      // Kiểm tra xem đã xoay xong chưa
      if (progress >= 1) {
        // Đặt chính xác các giá trị cuối cùng
        bookGroupRef.current.rotation.y = targetRotation;
        bookGroupRef.current.rotation.x = rotationStartX.current;
        bookGroupRef.current.rotation.z = rotationStartZ.current;
        bookGroupRef.current.scale.set(
          scaleStart.current,
          scaleStart.current,
          scaleStart.current
        );
        bookGroupRef.current.position.y = positionStartY.current;
        // Đã xoay xong, cho phép người dùng tự lật
        setAutoFlipEnabled(true);
        setShouldRotateBook(false);
        rotationStarted.current = false;
      }
    }
  });

  return (
    <group {...props} ref={bookGroupRef} rotation-y={targetRotation}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};
